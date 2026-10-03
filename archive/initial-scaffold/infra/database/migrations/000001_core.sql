BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS reference_data;
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS supplier;
CREATE SCHEMA IF NOT EXISTS payment;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS operation;
CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE reference_data.dataset_version (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_type text NOT NULL,
  version text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'reviewed', 'published', 'retired')),
  source_name text NOT NULL,
  source_reference text,
  effective_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (dataset_type, version)
);

CREATE TABLE reference_data.country (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES reference_data.dataset_version(id),
  iso_alpha2 char(2) NOT NULL,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  calling_code text NOT NULL,
  default_currency char(3) NOT NULL,
  region_code text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (dataset_version_id, iso_alpha2)
);

CREATE TABLE reference_data.operator (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES reference_data.dataset_version(id),
  country_id uuid NOT NULL REFERENCES reference_data.country(id),
  code text NOT NULL,
  name text NOT NULL,
  number_pattern text,
  enabled boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (dataset_version_id, country_id, code)
);

CREATE TABLE reference_data.product (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid NOT NULL REFERENCES reference_data.operator(id),
  code text NOT NULL UNIQUE,
  product_type text NOT NULL CHECK (product_type IN ('airtime_fixed', 'airtime_range')),
  face_amount_minor bigint,
  face_currency char(3) NOT NULL,
  face_exponent smallint NOT NULL CHECK (face_exponent BETWEEN 0 AND 3),
  min_amount_minor bigint,
  max_amount_minor bigint,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'retired')),
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (product_type = 'airtime_fixed' AND face_amount_minor IS NOT NULL)
    OR
    (product_type = 'airtime_range' AND min_amount_minor IS NOT NULL AND max_amount_minor IS NOT NULL AND min_amount_minor <= max_amount_minor)
  )
);

CREATE TABLE supplier.supplier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL CHECK (status IN ('onboarding', 'active', 'paused', 'terminated')),
  credential_secret_ref text,
  settlement_timezone text NOT NULL DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE supplier.supplier_sku (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES supplier.supplier(id),
  product_id uuid NOT NULL REFERENCES reference_data.product(id),
  external_sku_code text NOT NULL,
  cost_amount_minor bigint NOT NULL CHECK (cost_amount_minor >= 0),
  cost_currency char(3) NOT NULL,
  cost_exponent smallint NOT NULL CHECK (cost_exponent BETWEEN 0 AND 3),
  status text NOT NULL CHECK (status IN ('active', 'paused', 'retired')),
  version integer NOT NULL DEFAULT 1,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (supplier_id, external_sku_code, version),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE supplier.route_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES reference_data.product(id),
  version integer NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'retired')),
  rules jsonb NOT NULL,
  effective_from timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, version)
);

CREATE TABLE business.quote (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL CHECK (channel IN ('consumer_global', 'consumer_cn', 'partner_api')),
  customer_id uuid,
  product_id uuid NOT NULL REFERENCES reference_data.product(id),
  operator_id uuid NOT NULL REFERENCES reference_data.operator(id),
  recipient_e164_hash bytea NOT NULL,
  face_amount_minor bigint NOT NULL,
  face_currency char(3) NOT NULL,
  sale_amount_minor bigint NOT NULL CHECK (sale_amount_minor >= 0),
  service_fee_minor bigint NOT NULL CHECK (service_fee_minor >= 0),
  discount_minor bigint NOT NULL CHECK (discount_minor >= 0),
  payable_amount_minor bigint NOT NULL CHECK (payable_amount_minor >= 0),
  settlement_currency char(3) NOT NULL,
  settlement_exponent smallint NOT NULL CHECK (settlement_exponent BETWEEN 0 AND 3),
  pricing_version text NOT NULL,
  pricing_snapshot jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (payable_amount_minor = sale_amount_minor + service_fee_minor - discount_minor)
);

CREATE TABLE business.topup_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_number text NOT NULL UNIQUE,
  channel text NOT NULL CHECK (channel IN ('consumer_global', 'consumer_cn', 'partner_api')),
  customer_id uuid,
  quote_id uuid NOT NULL REFERENCES business.quote(id),
  product_id uuid NOT NULL REFERENCES reference_data.product(id),
  operator_id uuid NOT NULL REFERENCES reference_data.operator(id),
  country_code char(2) NOT NULL,
  recipient_e164_ciphertext bytea NOT NULL,
  recipient_e164_hash bytea NOT NULL,
  recipient_e164_masked text NOT NULL,
  payable_amount_minor bigint NOT NULL,
  payable_currency char(3) NOT NULL,
  payable_exponent smallint NOT NULL CHECK (payable_exponent BETWEEN 0 AND 3),
  status text NOT NULL CHECK (status IN (
    'pending_payment', 'payment_processing', 'paid', 'routing', 'submitted',
    'processing', 'succeeded', 'failed', 'refund_pending', 'refunded',
    'manual_review', 'cancelled'
  )),
  consent_version text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX topup_order_customer_created_idx ON business.topup_order (customer_id, created_at DESC);
CREATE INDEX topup_order_recipient_hash_idx ON business.topup_order (recipient_e164_hash, created_at DESC);
CREATE INDEX topup_order_work_queue_idx ON business.topup_order (status, updated_at)
  WHERE status IN ('paid', 'routing', 'submitted', 'processing', 'refund_pending', 'manual_review');

CREATE TABLE business.order_status_history (
  id bigserial PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES business.topup_order(id),
  previous_status text,
  current_status text NOT NULL,
  reason_code text NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('customer', 'operator', 'system', 'supplier')),
  actor_id text,
  correlation_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_status_history_order_idx ON business.order_status_history (order_id, occurred_at);

CREATE TABLE business.fulfillment_attempt (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES business.topup_order(id),
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  supplier_id uuid NOT NULL REFERENCES supplier.supplier(id),
  supplier_sku_id uuid NOT NULL REFERENCES supplier.supplier_sku(id),
  route_policy_id uuid REFERENCES supplier.route_policy(id),
  idempotency_key text NOT NULL UNIQUE,
  supplier_order_id text,
  status text NOT NULL CHECK (status IN ('created', 'submitted', 'accepted', 'processing', 'succeeded', 'failed', 'unknown')),
  supplier_code text,
  supplier_message text,
  submitted_at timestamptz,
  completed_at timestamptz,
  next_query_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, attempt_number),
  UNIQUE NULLS NOT DISTINCT (supplier_id, supplier_order_id)
);

CREATE TABLE payment.payment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES business.topup_order(id),
  provider text NOT NULL,
  provider_payment_id text,
  idempotency_key text NOT NULL UNIQUE,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL,
  exponent smallint NOT NULL CHECK (exponent BETWEEN 0 AND 3),
  status text NOT NULL CHECK (status IN ('created', 'authorizing', 'captured', 'failed', 'cancelled', 'partially_refunded', 'refunded')),
  captured_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT (provider, provider_payment_id)
);

CREATE TABLE payment.refund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payment.payment(id),
  order_id uuid NOT NULL REFERENCES business.topup_order(id),
  provider_refund_id text,
  idempotency_key text NOT NULL UNIQUE,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL,
  exponent smallint NOT NULL CHECK (exponent BETWEEN 0 AND 3),
  reason_code text NOT NULL,
  status text NOT NULL CHECK (status IN ('created', 'processing', 'succeeded', 'failed', 'manual_review')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT (provider_refund_id)
);

CREATE TABLE finance.ledger_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  owner_type text,
  owner_id uuid,
  currency char(3) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE finance.journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text NOT NULL UNIQUE,
  business_type text NOT NULL,
  business_reference text NOT NULL,
  description text NOT NULL,
  occurred_at timestamptz NOT NULL,
  posted_at timestamptz NOT NULL DEFAULT now(),
  reversal_of uuid REFERENCES finance.journal(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE finance.journal_line (
  id bigserial PRIMARY KEY,
  journal_id uuid NOT NULL REFERENCES finance.journal(id),
  account_id uuid NOT NULL REFERENCES finance.ledger_account(id),
  side text NOT NULL CHECK (side IN ('debit', 'credit')),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL,
  exponent smallint NOT NULL CHECK (exponent BETWEEN 0 AND 3),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX journal_line_account_idx ON finance.journal_line (account_id, id);
CREATE INDEX journal_business_reference_idx ON finance.journal (business_type, business_reference);

CREATE TABLE operation.audit_event (
  id bigserial PRIMARY KEY,
  actor_type text NOT NULL,
  actor_id text NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  reason text,
  source_ip inet,
  correlation_id uuid NOT NULL,
  before_summary jsonb,
  after_summary jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_event_resource_idx ON operation.audit_event (resource_type, resource_id, created_at DESC);

CREATE TABLE platform.idempotency_record (
  scope text NOT NULL,
  idempotency_key text NOT NULL,
  request_hash bytea NOT NULL,
  response_status integer,
  response_body jsonb,
  resource_id text,
  locked_until timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, idempotency_key)
);

CREATE TABLE platform.outbox_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type text NOT NULL,
  aggregate_id text NOT NULL,
  event_type text NOT NULL,
  event_version integer NOT NULL,
  correlation_id uuid NOT NULL,
  causation_id uuid,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL,
  published_at timestamptz,
  publish_attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX outbox_unpublished_idx ON platform.outbox_event (next_attempt_at)
  WHERE published_at IS NULL;

CREATE TABLE platform.inbox_message (
  consumer_name text NOT NULL,
  message_id uuid NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  result text NOT NULL,
  PRIMARY KEY (consumer_name, message_id)
);

COMMIT;
