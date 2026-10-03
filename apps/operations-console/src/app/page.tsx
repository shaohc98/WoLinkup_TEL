import {
  Activity,
  Bell,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  Headphones,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navigation = [
  [LayoutDashboard, "业务总览"],
  [ClipboardList, "充值订单"],
  [Activity, "履约中心"],
  [Boxes, "商品与供应商"],
  [CircleDollarSign, "财务与对账"],
  [ShieldCheck, "风险审核"],
  [Users, "客户管理"],
  [Headphones, "客服工单"],
] as const;

const orders = [
  ["WT20261003084211", "菲律宾 · Globe", "$10.49", "履约中", "2 分钟前"],
  ["WT20261003084207", "印度尼西亚 · Telkomsel", "$8.20", "已完成", "4 分钟前"],
  ["WT20261003084198", "泰国 · AIS", "$15.00", "待风控", "6 分钟前"],
  ["WT20261003084186", "马来西亚 · Maxis", "$12.50", "支付异常", "9 分钟前"],
  ["WT20261003084172", "越南 · Viettel", "$6.80", "已完成", "12 分钟前"],
] as const;

export default function OperationsPage() {
  return (
    <main className="console-shell">
      <aside>
        <div className="brand">
          <span>W</span>
          <div>
            <strong>WoLinkup TEL</strong>
            <small>运营管理后台</small>
          </div>
        </div>
        <nav aria-label="运营后台导航">
          {navigation.map(([Icon, label], index) => (
            <a className={index === 0 ? "active" : ""} href="#" key={label}>
              <Icon size={18} /> {label}
            </a>
          ))}
        </nav>
        <a className="settings-link" href="#">
          <Settings size={18} /> 系统设置
        </a>
      </aside>

      <section className="content">
        <header>
          <div className="search-control">
            <Search size={18} />
            <input placeholder="搜索订单号、手机号、供应商流水" />
          </div>
          <button className="icon-button" type="button" aria-label="通知">
            <Bell size={19} />
            <span />
          </button>
          <button className="account-button" type="button">
            <span>OP</span>
            <strong>运营管理员</strong>
            <ChevronDown size={16} />
          </button>
        </header>

        <div className="page-heading">
          <div>
            <p>2026年10月3日 · UTC+8</p>
            <h1>业务总览</h1>
          </div>
          <button className="period-button" type="button">
            今日 <ChevronDown size={16} />
          </button>
        </div>

        <section className="metrics">
          <article>
            <span>支付成功订单</span>
            <strong>8,462</strong>
            <small className="positive">较昨日 +7.4%</small>
          </article>
          <article>
            <span>充值成功率</span>
            <strong>98.31%</strong>
            <small className="positive">较昨日 +0.18%</small>
          </article>
          <article>
            <span>待处理异常</span>
            <strong>37</strong>
            <small className="attention">12 笔超过 30 分钟</small>
          </article>
          <article>
            <span>今日交易额</span>
            <strong>$96,280</strong>
            <small>已换算为 USD</small>
          </article>
        </section>

        <section className="operations-grid">
          <div className="orders-panel">
            <div className="panel-heading">
              <div>
                <h2>最近订单</h2>
                <p>实时订单与履约状态</p>
              </div>
              <a href="#">查看全部</a>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>订单号</th>
                    <th>充值目标</th>
                    <th>实付</th>
                    <th>状态</th>
                    <th>更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order[0]}>
                      <td>{order[0]}</td>
                      <td>{order[1]}</td>
                      <td>{order[2]}</td>
                      <td>
                        <span className={`status status-${order[3]}`}>
                          {order[3]}
                        </span>
                      </td>
                      <td>{order[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="alerts-panel">
            <div className="panel-heading">
              <div>
                <h2>待办与告警</h2>
                <p>需要人工介入的事项</p>
              </div>
              <Gauge size={20} />
            </div>
            <button className="alert-row" type="button">
              <span className="alert-count critical">12</span>
              <span>
                <strong>履约结果未知</strong>
                <small>需查询原供应商请求</small>
              </span>
              <ChevronDown size={17} />
            </button>
            <button className="alert-row" type="button">
              <span className="alert-count warning">8</span>
              <span>
                <strong>退款状态待确认</strong>
                <small>退款额度保持预占</small>
              </span>
              <ChevronDown size={17} />
            </button>
            <button className="alert-row" type="button">
              <span className="alert-count neutral">17</span>
              <span>
                <strong>对账差异</strong>
                <small>等待财务复核</small>
              </span>
              <ChevronDown size={17} />
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
