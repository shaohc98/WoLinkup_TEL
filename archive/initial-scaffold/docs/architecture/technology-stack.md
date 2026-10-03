# WoLinkup 技术栈基线

状态：Recommended Baseline

日期：2026-09-26

## 结论

WoLinkup 适合采用 TypeScript 全栈 monorepo、PostgreSQL 交易核心和可恢复异步任务体系。首期保持清晰的服务边界，但不把每个模块都独立部署；先形成三个 Web 应用、一个 API gateway、一个业务服务发布单元、一个支付财务发布单元和两个 worker 进程。

## 推荐技术

| 层级       | 推荐技术                                                      | 使用方式                                                     |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| 运行时     | Node.js 24 LTS、TypeScript 5.9                                | 所有服务开启 strict，生产只用 LTS                            |
| Monorepo   | pnpm 11、Turborepo 2                                          | 统一依赖、契约、构建缓存和测试任务                           |
| 消费者端   | Next.js 16 Active LTS、React 19                               | App Router；国际站 SSR/SEO，大陆端按 H5 优先                 |
| 运营后台   | Next.js 16、React 19                                          | 以客户端交互为主，复用鉴权、设计系统和构建链                 |
| 前端状态   | TanStack Query、React Hook Form、Zod                          | 服务端状态不进入全局前端 store；表单和接口边界校验           |
| 前端 UI    | Tailwind CSS、Radix UI、TanStack Table、Lucide                | 建立 WoLinkup token；后台强调密度、权限和审计提示            |
| 国际化     | next-intl、Intl API                                           | locale、时区、展示币种和文案版本分离                         |
| 后端框架   | NestJS、Fastify adapter                                       | NestJS 提供模块与依赖边界，Fastify 承担 HTTP 层              |
| API        | REST、OpenAPI 3.1、JSON Schema                                | 公网与内部同步接口统一契约；暂不引入 GraphQL                 |
| 数据库     | PostgreSQL 18 当前小版本                                      | 订单、支付、充值尝试、账本、审计和 outbox 的唯一事实源       |
| 数据访问   | Drizzle ORM、审核后的 SQL migration                           | 普通 CRUD 类型安全；账本、锁、分区和复杂查询保留显式 SQL     |
| 缓存与任务 | Redis 8、BullMQ                                               | 缓存、限流、短任务和延迟任务；不得保存唯一交易事实           |
| 可靠事件   | PostgreSQL transactional outbox + 幂等 inbox                  | 首期由发布 worker 投递；流量达到阈值后再引入专用事件平台     |
| 对象存储   | S3 兼容对象存储                                               | 对账单、导入文件、发票和加密原始报文                         |
| 身份权限   | OIDC/OAuth 2.1、MFA、服务端 RBAC/ABAC                         | 管理员使用企业身份源；消费者 OTP 与风控策略分离              |
| 可观测性   | OpenTelemetry、OTLP Collector、Prometheus/Grafana、Loki/Tempo | trace、metrics、logs 统一 correlation ID，日志集中脱敏       |
| 测试       | Vitest、Testcontainers、Playwright、契约测试                  | 领域、数据库、适配器、API 和端到端分层验证                   |
| 交付       | Docker、GitHub Actions、Terraform/OpenTofu                    | 优先托管容器、PostgreSQL 和 Redis；规模明确后再上 Kubernetes |

## 为什么适合 WoLinkup

### TypeScript 全栈

消费者端、运营后台、API、worker 和供应商适配器共享语言与契约，能降低早期团队协作成本。但只共享 DTO、值对象和基础工具，不共享跨服务数据库访问，也不把业务规则放进前端。

### PostgreSQL 作为交易核心

充值项目需要唯一约束、事务、行锁、精确金额、审计、复杂对账和不可变账本。PostgreSQL 比文档数据库更适合作为订单与财务事实源。金额保存为最小货币单位整数；汇率使用高精度 decimal/有理数，禁止 JavaScript 浮点数参与最终计价。

### BullMQ 只做可恢复调度

充值提交、状态查询、退款重试和通知适合异步执行。BullMQ 支持重试和退避，但 Redis 故障时仍可能出现任务丢失或重复，因此订单状态、下一执行时间和 outbox 必须写入 PostgreSQL。恢复任务通过扫描数据库重建，worker 全部按幂等方式实现。

### 暂不默认引入 Temporal、Kafka 和 Kubernetes

这三类技术都能解决真实问题，但首期同时引入会显著增加部署、监控和人才成本：

- 当单笔充值流程包含大量跨天等待、人工信号、复杂补偿，且 BullMQ 编排代码开始难以审计时，再引入 Temporal Cloud。
- 当 outbox 积压、消费者数量、事件吞吐或长期回放需求超过 PostgreSQL/Redis 方案时，再评估 Kafka、Redpanda 或托管事件平台。
- 当服务数量、团队数量、区域部署或独立扩缩容需求稳定出现时，再采用 Kubernetes；之前使用托管容器平台。

## 建议的首期部署单元

| 发布单元              | 包含内容                                    | 独立原因                         |
| --------------------- | ------------------------------------------- | -------------------------------- |
| `web-global`          | 国际消费者站                                | SEO、全球 CDN 和独立发布         |
| `web-cn`              | 中国大陆消费者端                            | 支付、域名与地区策略不同         |
| `web-admin`           | 运营后台                                    | 私网/零信任访问和严格权限        |
| `core-api`            | gateway、business、supplier、operation 模块 | 首期减少分布式运维，保持模块边界 |
| `finance-api`         | payment-finance-service                     | 凭证、网络与数据权限独立         |
| `recharge-worker`     | 充值提交、查询、超时恢复                    | 与同步 API 独立扩缩容            |
| `notification-worker` | 消息和 webhook                              | 故障不阻塞交易主链路             |

## 不建议的选择

- 不使用 MongoDB 作为订单、支付或账本主库。
- 不用微前端拆分三个规模尚小的前端。
- 不让支付回调或供应商回调直接修改多个服务数据库。
- 不把 Redis、BullMQ job 或前端状态当作订单事实。
- 不在结果未知时自动切换供应商重复充值。
- 不为追求“微服务”给每个后台菜单建立独立服务。

## 版本策略

- Node.js 使用 Active/Maintenance LTS，不使用 Current 版本承载生产流量。
- Next.js 使用 Active LTS 或 Maintenance LTS，不使用 canary。
- PostgreSQL 使用受支持主版本的当前 minor，并安排年度升级演练。
- 框架版本通过 Renovate/Dependabot 提出，CI 完成契约、迁移、构建和端到端验证后合并。

## 官方依据

- Node.js 版本与 LTS 状态：https://nodejs.org/en/about/previous-releases
- Next.js 支持策略：https://nextjs.org/support-policy
- NestJS Fastify adapter：https://docs.nestjs.com/techniques/performance
- PostgreSQL 支持策略：https://www.postgresql.org/support/versioning/
- Drizzle migration：https://orm.drizzle.team/docs/migrations
- BullMQ 幂等任务：https://docs.bullmq.io/patterns/idempotent-jobs
- OpenTelemetry JavaScript：https://opentelemetry.io/docs/languages/js/
