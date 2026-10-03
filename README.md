# WoLinkup TEL 全球话费充值平台

WoLinkup TEL 聚合全球国家、运营商与供应商充值网络，为国际消费者和中国大陆消费者提供海外手机号码充值，并提供统一运营、履约、财务、风控与售后能力。

本仓库只负责 TEL 业务。独立的 WoLinkup Payment Platform 负责收银台、支付方式、支付机构、商户号、支付路由、支付回调、支付侧退款执行和结算；TEL 仅通过防腐层调用该平台并维护业务投影。

## 权威依据

四份 V1.0 正式说明书是当前项目基线，原始 DOCX 及校验值均已纳入版本库。精读结论、冲突处理和结构决策见 [项目分析与结构安排](docs/00-governance/document-review-and-project-structure.md)，文档入口见 [文档中心](docs/README.md)。

## 仓库地图

```text
apps/          三个前端和两个后端运行单元
modules/       TEL 的 11 个领域模块
integrations/  支付平台与供应商防腐层
packages/      契约、SDK、校验、可观测性和 UI 基础包
database/      PostgreSQL 迁移、种子与运维 SQL
tests/         跨包的架构、契约、恢复、安全和端到端测试
tools/         支付/供应商模拟器与数据工具
deploy/        Compose、Caddy、可观测性和备份配置
docs/          正式文档、产品原型、ADR 与实施文档
archive/       与正式架构冲突的早期脚手架，只读保留
```

## 架构基线

- TypeScript 全栈，Node.js 24、NestJS 11、Next.js 16、React 19、pnpm 11。
- 采用模块化领域核心；首期运行单元为 `international-web`、`china-h5`、`operations-console`、`tel-api` 和 `tel-worker`。
- PostgreSQL 18 为权威数据库，按领域 schema 隔离；持久任务采用 Outbox/Inbox 与 pg-boss。
- 首期以单云主机加托管 PostgreSQL 部署，不引入 Redis、Kafka、Kubernetes，也不按领域拆成独立微服务。
- 报价、订单、支付投影、履约尝试、退款和财务事实分别建模，不用一个状态字段代替整条交易链路。

## 本地开始

```bash
corepack enable
pnpm install
pnpm verify
pnpm format:check
pnpm test
pnpm build
```

默认开发端口：国际站 `3000`、中国大陆 H5 `3001`、运营后台 `3002`、TEL API `4000`。完整技术与工程说明见[技术栈分析与工程骨架](docs/04-technical-architecture/engineering-stack-and-scaffold.md)。

当前仓库处于“工程骨架与契约基线”阶段。应用可以构建和启动，但交易业务尚未实现，不能视为生产系统。
