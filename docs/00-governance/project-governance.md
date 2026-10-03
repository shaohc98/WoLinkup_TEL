# 项目治理

**状态：** Draft

## 事实来源

| 内容               | 唯一事实来源                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| 当前正式范围与设计 | `docs/01-requirements`、`03-system-architecture`、`04-technical-architecture`、`05-domain-design` |
| 交互参考           | `docs/02-product-design/prototypes` 的只读原型基线                                                |
| API 与事件         | 经评审并发布的 `packages/api-contracts` 和 `packages/event-contracts`                             |
| 架构决策           | `docs/adr` 中已接受的 ADR                                                                         |
| 数据库结构         | `database/migrations` 中已执行的迁移                                                              |
| 运行行为           | 已发布代码、自动化测试和运行证据                                                                  |
| 生产操作           | `docs/11-operations` 中受控的 runbook                                                             |

出现冲突时先停止扩大影响，确认新的权威事实，再在同一个变更中同步契约、实现、测试和文档。

## 建议责任角色

| 范围                 | 责任角色                                       |
| -------------------- | ---------------------------------------------- |
| 产品范围与国家上线   | Product Owner                                  |
| 订单、目录与定价     | TEL Domain Owner                               |
| 供应商接入与 SLA     | Supplier Integration Owner                     |
| 支付平台契约         | TEL Integration Owner + Payment Platform Owner |
| 财务、退款与对账     | Finance Owner                                  |
| 双站与运营体验       | Channel Owners                                 |
| 身份、密钥与数据保护 | Security Owner                                 |
| 发布、SLO 与事件响应 | Platform/SRE Owner                             |

## 变更控制

- 普通功能至少一名代码 owner 审核。
- 公共契约、数据库与持久事件由生产者和至少一个消费者共同审核。
- 支付、退款、资金、路由、密钥、权限和个人信息变更要求双人审核。
- 紧急变更允许先缓解，但必须保留审计并设定复盘和补测期限。

## 发布证据

每次生产发布保留制品摘要、迁移列表、功能开关、审批、测试结果、监控链接、观察结论和回滚或补偿记录。
