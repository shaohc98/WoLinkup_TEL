# 技术栈分析与工程骨架

**状态：** Implemented baseline

本文把正式技术架构转化为可安装、可编译、可启动的工程结构。它规定第一阶段使用什么、为什么使用，以及哪些复杂度暂不引入。

## 1. 运行时与语言

| 技术           | 用途                       | 工程决定                                |
| -------------- | -------------------------- | --------------------------------------- |
| Node.js 24 LTS | 全部服务端和工程工具运行时 | `.nvmrc` 固定项目版本                   |
| TypeScript 6   | 前端、后端、契约和工具     | 全仓严格模式，不允许隐式 `any`          |
| pnpm 11        | workspace、依赖与拓扑构建  | 不使用 Turborepo/Nx，先保留单一任务层   |
| ESM / NodeNext | 服务端与共享包模块格式     | 包输出到 `dist`，公开入口使用 `exports` |

## 2. 前端工程

| 技术         | 作用                     | 边界                                  |
| ------------ | ------------------------ | ------------------------------------- |
| Next.js 16   | 三个 Web 应用框架        | App Router；首期不做微前端            |
| React 19     | 页面与交互组件           | 业务流程留在应用，领域规则由 API 决定 |
| TypeScript   | 页面、DTO 与组件类型     | 不直接复用后端领域实体                |
| Lucide React | 通用操作图标             | 不维护自绘通用图标集                  |
| 原生 CSS     | 当前骨架设计与响应式布局 | 暂不引入第二套组件框架或 CSS 运行时   |

三个前端是独立应用：

- `international-web`：国际站，多语言、多币种和支付方式展示，默认端口 `3000`。
- `china-h5`：中国大陆 H5，人民币展示和本地支付入口，默认端口 `3001`。
- `operations-console`：运营管理后台，面向桌面高频操作，默认端口 `3002`。

它们共享契约、SDK、国际化和无业务语义 UI 基础，但不把渠道差异收敛成一个充满条件分支的前端。

## 3. 后端工程

| 技术                 | 作用                         | 边界                                                |
| -------------------- | ---------------------------- | --------------------------------------------------- |
| NestJS 11            | HTTP API 与 worker 依赖注入  | 只组合应用服务，不让框架进入领域模型                |
| REST + OpenAPI 3.1.1 | 对消费者端和运营端的同步接口 | 统一 `/api/v1`；机器契约需单独评审                  |
| Zod                  | 配置、事件和跨系统边界校验   | Nest DTO 可使用 class-validator，领域内部不用装饰器 |
| pg-boss              | 持久化任务和至少一次投递     | 只在 `tel-worker` 启动，复用 PostgreSQL             |
| Pino                 | 结构化日志                   | 手机号、令牌、密钥和完整外部载荷必须脱敏            |
| OpenTelemetry API    | trace 与跨进程关联           | 统一传播 correlation ID                             |

`tel-api` 默认端口为 `4000`，提供健康检查和 Swagger 运行时文档入口。`tel-worker` 是无 HTTP 的 Nest application context；本地默认关闭队列连接，设置 `WORKER_QUEUE_ENABLED=true` 后连接 pg-boss。

## 4. 领域与代码边界

11 个领域模块均采用：

```text
src/
  domain/          聚合、实体、值对象和领域规则
  application/     命令、查询、用例和事务编排
  ports/           仓储与外部能力接口
  infrastructure/  PostgreSQL、消息和适配实现
  api/             模块公开 facade、DTO 和元数据
  index.ts         只重新导出 api
tests/             模块级测试
```

依赖方向为 `api/application -> domain + ports <- infrastructure`。其他模块不能导入某模块的 `domain` 或 `infrastructure`，只能使用根公开入口、API 契约或持久事件。

## 5. 数据与异步处理

| 技术           | 用途                                        |
| -------------- | ------------------------------------------- |
| PostgreSQL 18  | 交易权威数据、约束、Outbox/Inbox 和任务存储 |
| Kysely         | 类型安全 SQL 和基础设施实现                 |
| `pg`           | PostgreSQL 驱动与连接池                     |
| pg-boss        | 延迟任务、重试和 worker 消费                |
| Docker Compose | 本地 PostgreSQL 环境                        |

数据库按领域 schema 管理。关键幂等、退款额度、单订单未解决履约尝试等约束必须进入数据库。首期不增加 Redis、BullMQ、Kafka 或 RabbitMQ。

## 6. 外部集成

- `payment-platform` 只定义 WoLinkup Payment Platform 防腐端口；不包含 PSP SDK、商户号、支付路由和收银台。
- `supplier-spi` 统一供应商提交、原单查询、能力声明和结果语义。
- `supplier-adapters` 注册具体协议实现，但不能决定业务路由或在未知状态下自行重充。
- 本地支付和供应商模拟器用于契约测试、重复事件、超时和结果未知场景。

## 7. 质量、安全与交付

| 技术/机制                    | 作用                                             |
| ---------------------------- | ------------------------------------------------ |
| ESLint 9 + typescript-eslint | 静态代码规范与类型导入约束                       |
| Prettier 3                   | 统一格式                                         |
| Vitest 4                     | 单元、架构和轻量集成测试                         |
| Playwright                   | 进入页面流程实现阶段后用于浏览器端到端测试       |
| GitHub Actions               | 安装、仓库校验、格式、lint、构建、类型检查和测试 |
| Dependabot                   | npm 与 Actions 依赖更新                          |
| Docker Compose + Caddy       | 本地依赖与首期部署入口                           |

架构测试会阻止 Redis、BullMQ 和常见支付机构 SDK 进入活动工作区，并检查 11 个领域模块的层级是否完整。

## 8. 本地运行

```bash
corepack enable
pnpm install
docker compose -f deploy/compose/dev.compose.yaml up -d
pnpm dev
```

也可以分别启动：

```bash
pnpm dev:international
pnpm dev:china
pnpm dev:operations
pnpm dev:api
pnpm dev:worker
```

提交前统一执行：

```bash
pnpm verify
pnpm format:check
pnpm lint
pnpm build
pnpm typecheck
pnpm test
```

## 9. 当前骨架不代表已实现

当前完成的是运行应用、领域边界、外部端口、共享技术包和质量门槛。报价、订单、支付事件处理、履约、退款、资金事实、对账、认证授权和数据库迁移仍需按业务优先级逐步实现。页面中的国家、金额和运营数据是明确的界面样例，不是生产主数据。

## 10. 暂不引入

- Redis、BullMQ、Kafka、RabbitMQ。
- Kubernetes、服务网格、多区域活动部署。
- 按领域拆分的独立微服务和微前端。
- 任一支付服务商 SDK、生产密钥或 TEL 内部收银台。
- 未完成法律、资金与会计准入的余额钱包。

只有容量、隔离、团队所有权或合规要求形成证据后，才通过 ADR 引入上述复杂度。
