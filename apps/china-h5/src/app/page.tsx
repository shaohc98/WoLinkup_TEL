import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Headphones,
  History,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const amounts = [
  { face: "₱100", price: "¥13.20" },
  { face: "₱300", price: "¥39.10" },
  { face: "₱500", price: "¥64.80" },
  { face: "₱1000", price: "¥128.60" },
  { face: "₱1500", price: "¥192.20" },
  { face: "其他面额", price: "自定义" },
];

export default function ChinaTopupPage() {
  return (
    <main className="h5-shell">
      <header>
        <a className="brand" href="#">
          <span>W</span> WoLinkup
        </a>
        <div className="header-actions">
          <button aria-label="充值记录" type="button">
            <History size={20} />
          </button>
          <button aria-label="在线客服" type="button">
            <Headphones size={20} />
          </button>
        </div>
      </header>

      <section className="welcome">
        <span>全球话费直充</span>
        <h1>给海外号码充值</h1>
        <p>人民币计价，订单状态全程可查</p>
      </section>

      <section className="recharge-form">
        <div className="section-title">
          <span>1</span>
          <h2>填写充值号码</h2>
        </div>

        <button className="country-row" type="button">
          <span className="country-code">PH</span>
          <span>
            <strong>菲律宾</strong>
            <small>国家/地区</small>
          </span>
          <ChevronDown size={18} />
        </button>

        <div className="phone-row">
          <span>+63</span>
          <Smartphone size={19} />
          <input inputMode="tel" placeholder="请输入海外手机号码" />
        </div>

        <div className="operator-row">
          <span className="operator-logo">G</span>
          <span>
            <strong>Globe</strong>
            <small>已识别运营商</small>
          </span>
          <button type="button">
            更换 <ChevronRight size={15} />
          </button>
        </div>

        <div className="section-title amount-title">
          <span>2</span>
          <h2>选择充值金额</h2>
        </div>
        <div className="amount-grid">
          {amounts.map((amount, index) => (
            <button
              className={index === 2 ? "amount active" : "amount"}
              key={amount.face}
              type="button"
            >
              <strong>{amount.face}</strong>
              <small>{amount.price}</small>
            </button>
          ))}
        </div>

        <div className="order-total">
          <span>应付金额</span>
          <strong>¥64.80</strong>
        </div>
        <button className="submit-button" type="button">
          确认号码与金额
        </button>
      </section>

      <section className="assurance">
        <div>
          <Clock3 size={19} />
          <span>到账进度可查</span>
        </div>
        <div>
          <ShieldCheck size={19} />
          <span>支付信息安全</span>
        </div>
        <div>
          <Headphones size={19} />
          <span>中文客服支持</span>
        </div>
      </section>
    </main>
  );
}
