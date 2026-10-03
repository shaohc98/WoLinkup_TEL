# 订单生命周期

状态：Draft

## 分离的生命周期

一个充值交易至少包含四个独立但关联的聚合：

| 聚合                | 解决的问题                         | 典型终态                             |
| ------------------- | ---------------------------------- | ------------------------------------ |
| Topup Order         | 客户购买了什么，当前总体结果是什么 | `succeeded`、`refunded`、`cancelled` |
| Payment             | 客户资金是否被捕获/退回            | `captured`、`refunded`、`failed`     |
| Fulfillment Attempt | 某供应商是否完成这次充值           | `succeeded`、`failed`、`unknown`     |
| Refund              | 某次退款请求是否完成               | `succeeded`、`failed`                |

这些状态不能合并。例如支付成功不等于充值成功，供应商超时不等于充值失败，订单退款中也不等于支付已经退回。

## 订单状态

| 状态                 | 含义                 | 可进入的主要下一状态                                 |
| -------------------- | -------------------- | ---------------------------------------------------- |
| `pending_payment`    | 等待用户发起支付     | `payment_processing`、`cancelled`                    |
| `payment_processing` | 渠道结果未确认       | `paid`、`pending_payment`、`manual_review`           |
| `paid`               | 已确认收款并记账     | `routing`、`refund_pending`、`manual_review`         |
| `routing`            | 选择供应 SKU         | `submitted`、`refund_pending`、`manual_review`       |
| `submitted`          | 已提交供应商         | `processing`、`succeeded`、`failed`、`manual_review` |
| `processing`         | 供应商确认处理中     | `succeeded`、`failed`、`manual_review`               |
| `failed`             | 已明确无法充值       | `refund_pending`、`manual_review`                    |
| `refund_pending`     | 退款已创建但未完成   | `refunded`、`manual_review`                          |
| `manual_review`      | 自动流程无法安全判定 | 由受控命令恢复到合法状态                             |
| `succeeded`          | 充值成功终态         | 无；冲正走独立业务                                   |
| `refunded`           | 资金已退回终态       | 无                                                   |
| `cancelled`          | 未捕获支付的取消终态 | 无                                                   |

## 超时与重试

- 网络超时表示“结果未知”，不是失败。
- 同一供应商的安全重试必须复用幂等键或供应商唯一客户端订单号。
- 只有收到明确失败且协议保证不会迟到成功时，才允许切换供应商。
- 状态未知超过策略阈值后进入人工复核，继续定时查询但停止新的履约尝试。
- 回调可能早于同步响应或查询结果，所有处理都按版本和终态优先级幂等合并。

## 客户可见状态

内部状态不直接暴露。客户端使用较稳定的映射：`等待付款`、`处理中`、`已到账`、`退款中`、`已退款`、`需要协助`。错误文案不得泄露供应商、风控策略或内部拓扑。
