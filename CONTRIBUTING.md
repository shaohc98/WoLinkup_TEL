# 贡献指南

## 开发约定

1. 先阅读对应产品需求、领域说明和 ADR，再修改代码。
2. 新增跨边界字段时先修改 `packages/api-contracts` 或 `packages/event-contracts`，并明确兼容策略。
3. 金额、汇率和时区逻辑必须有边界测试；外部调用必须有幂等和超时测试。
4. 数据库变更只能新增迁移，已发布迁移不得重写。
5. 提交不得包含真实手机号、支付凭证、供应商密钥或生产数据。

## 分支与提交

- 分支建议使用 `feature/`、`fix/`、`docs/` 或 `chore/` 前缀。
- 提交信息采用 `type(scope): summary`，例如 `feat(order): add retry policy`。
- Pull Request 必须写清业务影响、风险、回滚方式和验证证据。

## 合并门槛

```bash
pnpm verify
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

涉及订单、支付平台集成、退款、路由、资金事实或个人信息的改动至少需要两人评审。
