# 能力地图

| 一级域   | 二级能力                                       | MVP    | 责任模块                                                   |
| -------- | ---------------------------------------------- | ------ | ---------------------------------------------------------- |
| 渠道端   | 国际站、中国大陆站、运营后台                   | 核心   | `apps/international-web`、`china-h5`、`operations-console` |
| 身份客户 | 登录、游客、客户、常用号码、同意记录           | 核心   | `modules/customer`、`modules/site`                         |
| 商品目录 | 国家、号码计划、运营商、商品、面额、可售状态   | 核心   | `modules/catalog`、`modules/foundation`                    |
| 定价     | 采购价、销售价、服务费、汇率锁定和报价         | 核心   | `modules/pricing`、`modules/procurement`                   |
| 交易订单 | 报价消费、下单、状态、历史、取消和售后         | 核心   | `modules/order`                                            |
| 充值履约 | 路由结果、提交、查询、回调、超时和恢复         | 核心   | `modules/fulfillment`、`apps/tel-worker`                   |
| 供应网络 | 供应商、SKU 映射、余额、配额和 SLA             | 核心   | `modules/procurement`、`integrations/suppliers`            |
| 支付衔接 | 会话、状态投影、标准事件与退款请求             | 核心   | 独立 Payment Platform + `integrations/payment-platform`    |
| 财务     | 业务财务事实、供应商资金、退款、结算投影和对账 | 核心   | `modules/finance`                                          |
| 运营     | 客服、内容、营销、权限和审计                   | 精简版 | 所属领域模块 + `apps/operations-console`                   |
| 平台     | 配置、事件、任务、可观测性和风控               | 核心   | `modules/foundation`、`modules/risk`、`packages/*`         |

## 上线前必须闭环的场景

1. 支付成功且充值成功。
2. 支付失败或用户取消。
3. 支付成功、供应商明确失败、自动退款成功。
4. 支付成功、供应商超时、查询后成功。
5. 支付成功、供应商状态未知、进入人工队列且不重复充值。
6. 支付回调、供应商回调和客户端重试乱序到达。
7. 自动退款失败并进入人工处理。
8. 供应商对账不一致、财务差异关闭且全程可审计。
