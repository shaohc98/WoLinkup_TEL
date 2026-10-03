import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Headphones,
  LockKeyhole,
  Phone,
} from "lucide-react";

const amounts = ["$5", "$10", "$20", "$30"];

export default function InternationalTopupPage() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="WoLinkup TEL home">
          <span className="brand-mark">W</span>
          <span>WoLinkup TEL</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#top-up">Top up</a>
          <a href="#orders">My orders</a>
          <a href="#support">Support</a>
        </nav>
        <button className="locale-button" type="button">
          <Globe2 size={17} /> EN / USD <ChevronDown size={15} />
        </button>
      </header>

      <section className="workspace" id="top-up">
        <div className="intro">
          <span className="eyebrow">International mobile top-up</span>
          <h1>Send airtime across borders.</h1>
          <p>
            Choose a destination and confirm the number. We will show the final
            price before creating the order.
          </p>
          <div className="service-points">
            <span>
              <CheckCircle2 size={18} /> Price locked at checkout
            </span>
            <span>
              <LockKeyhole size={18} /> Secure payment session
            </span>
            <span>
              <Headphones size={18} /> Traceable order support
            </span>
          </div>
        </div>

        <form className="topup-panel">
          <div className="step-heading">
            <span>01</span>
            <div>
              <h2>Recipient number</h2>
              <p>Start with the destination country.</p>
            </div>
          </div>

          <label htmlFor="country">Country or region</label>
          <button className="select-control" id="country" type="button">
            <span className="flag">PH</span>
            <span>
              <strong>Philippines</strong>
              <small>+63</small>
            </span>
            <ChevronDown size={18} />
          </button>

          <label htmlFor="phone">Mobile number</label>
          <div className="phone-control">
            <span>+63</span>
            <Phone size={18} />
            <input id="phone" inputMode="tel" placeholder="912 345 6789" />
          </div>

          <fieldset>
            <legend>Top-up amount</legend>
            <div className="amount-grid">
              {amounts.map((amount, index) => (
                <button
                  className={index === 1 ? "amount active" : "amount"}
                  key={amount}
                  type="button"
                >
                  <strong>{amount}</strong>
                  <small>
                    {["PHP 280", "PHP 560", "PHP 1,120", "PHP 1,680"][index]}
                  </small>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="quote-row">
            <span>Due now</span>
            <strong>$10.49 USD</strong>
          </div>
          <button className="primary-action" type="button">
            Review order <ArrowRight size={18} />
          </button>
        </form>
      </section>

      <section className="coverage" id="orders">
        <div>
          <span className="metric">200+</span>
          <span>destinations in the catalog</span>
        </div>
        <div>
          <span className="metric">24/7</span>
          <span>order status availability</span>
        </div>
        <div>
          <span className="metric">1</span>
          <span>traceable order from payment to delivery</span>
        </div>
      </section>
    </main>
  );
}
