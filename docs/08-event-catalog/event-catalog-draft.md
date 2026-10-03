# 事件目录

状态：Draft

| 事件                                 | 生产者         | 主要消费者                          | 触发事实                   |
| ------------------------------------ | -------------- | ----------------------------------- | -------------------------- |
| `payment.status_changed.v1`          | 支付平台防腐层 | order、finance、risk                | 标准支付投影发生变化       |
| `payment.refund_status_changed.v1`   | 支付平台防腐层 | finance、order                      | 支付侧退款结果变化         |
| `topup.order_status_changed.v1`      | order          | operations、notification projection | 订单合法状态迁移           |
| `topup.attempt_requested.v1`         | fulfillment    | tel-worker                          | 已创建可安全提交的履约尝试 |
| `topup.attempt_status_changed.v1`    | fulfillment    | order、finance、operations          | 供应商结果完成标准化       |
| `supplier.health_changed.v1`         | procurement    | fulfillment、operations             | 供应商通道健康状态变化     |
| `catalog.version_published.v1`       | catalog        | site、pricing、apps cache           | 新主数据版本生效           |
| `reconciliation.difference_found.v1` | finance        | operations                          | 对账发现需处理差异         |

事件名携带主版本；payload 只包含消费方需要的稳定事实。敏感字段使用受控引用或脱敏值，不在事件总线上广播完整手机号和支付材料。消费者应保存 message ID，处理成功与业务副作用在同一事务完成。
