(function () {
  "use strict";

  const styles = `
    .maker-section { background: linear-gradient(145deg, #fffdf9 0%, #f6ecdd 100%); }
    .maker-heading { max-width: 720px; margin: 0 auto 2.2rem; text-align: center; }
    .maker-heading h2, .trade-heading h2 { color: var(--brown-dark); font-size: clamp(2.1rem, 4vw, 3.2rem); margin-bottom: .65rem; }
    .maker-heading p, .trade-heading p { color: var(--text-muted); }
    .maker-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.4rem; align-items: stretch; }
    .maker-card { padding: clamp(1.35rem, 4vw, 2.2rem); border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: rgba(255,253,249,.9); box-shadow: var(--shadow-sm); }
    .maker-card h3 { margin-bottom: 1rem; color: var(--brown-dark); font-size: clamp(1.65rem, 3vw, 2rem); }
    .maker-brand { display: inline-flex; margin-bottom: 1rem; color: var(--maroon); font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .maker-address { margin-bottom: 1.3rem; color: var(--text-main); font-size: 1.04rem; line-height: 1.8; font-style: normal; }
    .maker-facts { display: grid; grid-template-columns: 1fr; gap: .75rem; margin: 0 0 1.25rem; }
    .maker-fact { padding: .85rem 1rem; border-radius: var(--radius-sm); background: var(--green-light); }
    .maker-fact dt { color: var(--green-accent); font-size: .74rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .maker-fact dd { margin: .15rem 0 0; overflow-wrap: anywhere; color: var(--brown-dark); font-weight: 700; }
    .maker-actions { display: flex; flex-wrap: wrap; gap: .7rem; }
    .maker-actions .btn { flex: 1 1 150px; }
    .availability-card { padding: clamp(1.35rem, 4vw, 2.2rem); border-radius: var(--radius-lg); color: #fffdf9; background: linear-gradient(145deg, #355c3a, #2f1f1c); box-shadow: var(--shadow-md); }
    .availability-card h3 { color: #fffdf9; font-size: clamp(1.8rem, 3vw, 2.25rem); margin-bottom: .45rem; }
    .availability-intro { margin-bottom: 1.1rem; color: rgba(255,253,249,.82); }
    .city-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; }
    .city-card { display: flex; min-height: 78px; align-items: center; gap: .7rem; padding: .85rem; border: 1px solid rgba(255,253,249,.24); border-radius: 14px; background: rgba(255,255,255,.09); }
    .city-mark { display: grid; width: 36px; height: 36px; flex: 0 0 36px; place-items: center; border-radius: 50%; color: #372b23; background: #e6c77e; }
    .city-card strong { display: block; color: #fffdf9; font-size: .98rem; line-height: 1.2; }
    .city-card span:last-child { display: block; margin-top: .2rem; color: rgba(255,253,249,.78); font-size: .76rem; }
    .availability-note { margin-top: .85rem; color: rgba(255,253,249,.76); font-size: .82rem; }
    .trade-section { background: var(--surface); }
    .trade-heading { max-width: 760px; margin: 0 auto 2rem; text-align: center; }
    .trade-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; align-items: start; }
    .trade-card { padding: clamp(1.2rem, 3vw, 1.8rem); border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: linear-gradient(180deg, #fffdf9, #f8f1e7); box-shadow: var(--shadow-sm); }
    .trade-card h3 { margin-bottom: .45rem; color: var(--brown-dark); font-size: 1.8rem; }
    .trade-card > p { margin-bottom: 1.2rem; color: var(--text-muted); }
    .trade-form .form-row { margin-bottom: .2rem; }
    .trade-form .form-group { margin-bottom: .85rem; }
    .trade-form .form-group label { display: block; margin-bottom: .4rem; font-size: .85rem; font-weight: 600; color: var(--brown-dark); }
    .trade-form input, .trade-form select, .trade-form textarea { width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: .75rem .85rem; background: rgba(255,255,255,.85); color: var(--text-main); }
    .trade-form input:focus, .trade-form select:focus, .trade-form textarea:focus { outline: none; border-color: var(--green-accent); box-shadow: 0 0 0 3px rgba(53,92,58,.12); }
    .trade-form .trade-status { min-height: 1.4rem; margin: .5rem 0; color: var(--green-accent); font-size: .86rem; }
    @media (min-width: 760px) { .maker-grid { grid-template-columns: .92fr 1.08fr; gap: 1.6rem; } .maker-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); } .maker-fact:first-child { grid-column: 1 / -1; } .trade-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 360px) { .city-grid { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .maker-section *, .trade-section *, .maker-section *::before, .trade-section *::before { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
  `;

  const section = document.createElement("section");
  section.className = "section maker-section";
  section.id = "manufacturer";
  section.setAttribute("aria-labelledby", "maker-title");
  section.innerHTML = `
    <div class="container">
      <header class="maker-heading">
        <p class="eyebrow">Made with care in Kerala</p>
        <h2 id="maker-title">Manufacturer &amp; Product Information</h2>
        <p>Traditional Kerala flavour, made with care. Discover our product availability and order directly with us.</p>
      </header>
      <div class="maker-grid">
        <article class="maker-card" aria-labelledby="maker-details-title">
          <span class="maker-brand">Khamaruzz Nadan Achaar</span>
          <h3 id="maker-details-title">Proudly made in Kerala</h3>
          <address class="maker-address"><strong>Manufactured by:</strong><br>Khamaruzz Nadan Achaar<br>Vazakkam Vettil, Behind KMR Steels,<br>Ulleryi 19, Atholi, Kozhikode,<br>Kerala – 673612, India.</address>
          <dl class="maker-facts">
            <div class="maker-fact"><dt>FSSAI Licence No.</dt><dd>21326239000445</dd></div>
            <div class="maker-fact"><dt>Country of Origin</dt><dd>India</dd></div>
          </dl>
          <div class="maker-actions"><a class="btn btn-primary" href="#products">Order Now</a><a class="btn btn-secondary" href="https://wa.me/919645778508?text=Hi%21%20I%27d%20like%20to%20order%20Khamaruzz%20Nadan%20Achaar." target="_blank" rel="noopener noreferrer">Order on WhatsApp</a></div>
        </article>
        <section class="availability-card" aria-labelledby="availability-title">
          <h3 id="availability-title">Where to Find Our Achaar</h3>
          <p class="availability-intro">Ask us about ordering and delivery to your area.</p>
          <div class="city-grid" role="list" aria-label="Product availability locations">
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Kerala</strong><span>Our home state</span></span></div>
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Bengaluru</strong><span>Karnataka</span></span></div>
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Mumbai</strong><span>Maharashtra</span></span></div>
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Delhi</strong><span>National Capital Territory</span></span></div>
          </div>
          <p class="availability-note">Availability locations only; no individual shops or distribution partners are listed. Confirm delivery details with us when ordering.</p>
        </section>
      </div>
    </div>`;

  const tradeSection = document.createElement("section");
  tradeSection.className = "section trade-section";
  tradeSection.id = "trade-enquiry";
  tradeSection.setAttribute("aria-labelledby", "trade-title");
  tradeSection.innerHTML = `
    <div class="container">
      <header class="trade-heading">
        <p class="eyebrow">Retail &amp; distribution partners</p>
        <h2 id="trade-title">Stock Khamaruzz in Your Business</h2>
        <p>Retail supermarkets and distributors can share their business details and requirements. Submit an enquiry and we'll continue the conversation with you on WhatsApp.</p>
      </header>
      <div class="trade-grid">
        <article class="trade-card">
          <h3>Retail supermarket enquiry</h3>
          <p>For supermarkets and retail stores interested in stocking our products.</p>
          <form class="trade-form" data-trade-form="Retail Supermarket" novalidate>
            <div class="form-row"><div class="form-group"><label>Business / supermarket name<input name="Business name" autocomplete="organization" required></label></div><div class="form-group"><label>Contact person<input name="Contact person" autocomplete="name" required></label></div></div>
            <div class="form-row"><div class="form-group"><label>Phone number<input name="Phone" type="tel" inputmode="numeric" pattern="[6-9][0-9]{9}" placeholder="10-digit mobile number" autocomplete="tel" required></label></div><div class="form-group"><label>Business email<input name="Email" type="email" autocomplete="email" required></label></div></div>
            <div class="form-row"><div class="form-group"><label>City / state<input name="Location" autocomplete="address-level2" required></label></div><div class="form-group"><label>Number of outlets<input name="Number of outlets" type="number" min="1" placeholder="e.g. 3" required></label></div></div>
            <div class="form-row"><div class="form-group"><label>Products of interest<input name="Products of interest" placeholder="Pickles, kondattam, or both" required></label></div><div class="form-group"><label>Estimated monthly requirement<input name="Monthly requirement" placeholder="Units or cartons" required></label></div></div>
            <div class="form-group"><label>Additional details<textarea name="Additional details" rows="3" placeholder="Delivery, preferred pack sizes, or other requirements"></textarea></label></div>
            <p class="trade-status" role="status" aria-live="polite"></p>
            <button type="submit" class="btn btn-primary btn-block">Send supermarket enquiry on WhatsApp</button>
          </form>
        </article>
        <article class="trade-card">
          <h3>Distributor enquiry</h3>
          <p>For distributors interested in representing Khamaruzz in their territory.</p>
          <form class="trade-form" data-trade-form="Distributor" novalidate>
            <div class="form-row"><div class="form-group"><label>Business / distributor name<input name="Business name" autocomplete="organization" required></label></div><div class="form-group"><label>Contact person<input name="Contact person" autocomplete="name" required></label></div></div>
            <div class="form-row"><div class="form-group"><label>Phone number<input name="Phone" type="tel" inputmode="numeric" pattern="[6-9][0-9]{9}" placeholder="10-digit mobile number" autocomplete="tel" required></label></div><div class="form-group"><label>Business email<input name="Email" type="email" autocomplete="email" required></label></div></div>
            <div class="form-row"><div class="form-group"><label>City / state<input name="Location" autocomplete="address-level2" required></label></div><div class="form-group"><label>Distribution area<input name="Distribution area" placeholder="Districts, cities, or states" required></label></div></div>
            <div class="form-row"><div class="form-group"><label>GSTIN (optional)<input name="GSTIN" autocomplete="off" placeholder="If available"></label></div><div class="form-group"><label>Estimated monthly requirement<input name="Monthly requirement" placeholder="Units or cartons" required></label></div></div>
            <div class="form-group"><label>Additional details<textarea name="Additional details" rows="3" placeholder="Current distribution network or other requirements"></textarea></div>
            <p class="trade-status" role="status" aria-live="polite"></p>
            <button type="submit" class="btn btn-primary btn-block">Send distributor enquiry on WhatsApp</button>
          </form>
        </article>
      </div>
    </div>`;

  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);

  const about = document.getElementById("about");
  if (!about) return;
  about.insertAdjacentElement("afterend", section);
  section.insertAdjacentElement("afterend", tradeSection);

  tradeSection.querySelectorAll("[data-trade-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".trade-status");
      if (!form.reportValidity()) {
        if (status) status.textContent = "Please complete the required fields with valid contact details.";
        return;
      }

      const details = Array.from(new FormData(form).entries())
        .filter(([, value]) => String(value).trim())
        .map(([label, value]) => `*${label}:* ${String(value).trim()}`)
        .join("\n");
      const message = `*New ${form.dataset.tradeForm} Enquiry*\n\n${details}`;
      window.open(`https://wa.me/919645778508?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      if (status) status.textContent = "Your WhatsApp enquiry is ready. Send the message in WhatsApp to complete your enquiry.";
    });
  });
})();
