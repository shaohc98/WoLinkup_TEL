# 领域模块

11 个 TEL 领域模块在首期组合进 `tel-api` 和 `tel-worker`，目录边界不代表微服务。每个模块后续使用 `domain/application/ports/infrastructure/api/tests` 结构，跨模块只允许调用公开 facade、DTO 或已发布事件。

支付 D09 属于独立 Payment Platform，因此不在 `modules/` 中建立支付模块。
