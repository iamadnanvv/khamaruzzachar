(function () {
  "use strict";

  const styles = `
    .maker-section { background: linear-gradient(145deg, #fffdf9 0%, #f6ecdd 100%); }
    .maker-heading { max-width: 720px; margin: 0 auto 2.2rem; text-align: center; }
    .maker-heading h2 { color: var(--brown-dark); font-size: clamp(2.1rem, 4vw, 3.2rem); margin-bottom: .65rem; }
    .maker-heading p { color: var(--text-muted); }
    .maker-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.4rem; align-items: stretch; }
    .maker-card { position: relative; overflow: hidden; padding: clamp(1.35rem, 4vw, 2.2rem); border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: rgba(255,253,249,.92); box-shadow: var(--shadow-md); }
    .maker-card::after { content: ""; position: absolute; width: 190px; height: 190px; right: -76px; bottom: -96px; border: 1px solid rgba(217,179,107,.42); border-radius: 50%; box-shadow: 0 0 0 16px rgba(217,179,107,.08), 0 0 0 34px rgba(217,179,107,.06); pointer-events: none; }
    .maker-card h3 { margin-bottom: 1rem; color: var(--brown-dark); font-size: clamp(1.65rem, 3vw, 2rem); }
    .maker-brand { display: inline-flex; align-items: center; gap: .55rem; margin-bottom: 1rem; color: var(--maroon); font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .maker-brand::before { content: "✦"; color: var(--gold); font-size: 1rem; }
    .maker-address { position: relative; z-index: 1; margin-bottom: 1.3rem; color: var(--text-main); font-size: 1.04rem; line-height: 1.8; font-style: normal; }
    .maker-facts { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; margin: 0; }
    .maker-fact { padding: .85rem 1rem; border-radius: var(--radius-sm); background: var(--green-light); }
    .maker-fact dt { color: var(--green-accent); font-size: .74rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .maker-fact dd { margin: .15rem 0 0; overflow-wrap: anywhere; color: var(--brown-dark); font-weight: 700; }
    .availability-card { position: relative; overflow: hidden; padding: clamp(1.35rem, 4vw, 2.2rem); border-radius: var(--radius-lg); color: #fffdf9; background: radial-gradient(ellipse at 85% 12%, rgba(217,179,107,.22), transparent 35%), linear-gradient(145deg, #3c3028, #263d2d); box-shadow: var(--shadow-md); }
    .availability-card h3 { color: #fffdf9; font-size: clamp(1.8rem, 3vw, 2.25rem); margin-bottom: .45rem; }
    .availability-intro { max-width: 430px; margin-bottom: 1.35rem; color: rgba(255,253,249,.78); }
    .india-motif { display: flex; align-items: center; gap: .65rem; margin-bottom: 1.4rem; color: #f0d7a2; font-size: .76rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .india-motif::before, .india-motif::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, rgba(240,215,162,.65)); }
    .india-motif::after { transform: scaleX(-1); }
    .city-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; }
    .city-card { display: flex; min-height: 86px; align-items: center; gap: .7rem; padding: .85rem; border: 1px solid rgba(255,253,249,.2); border-radius: 14px; background: rgba(255,255,255,.08); }
    .city-mark { display: grid; width: 36px; height: 36px; flex: 0 0 36px; place-items: center; border-radius: 50%; color: #372b23; background: #e6c77e; font-size: 1rem; }
    .city-card strong { display: block; color: #fffdf9; font-size: .98rem; line-height: 1.2; }
    .city-card span:last-child { display: block; margin-top: .2rem; color: rgba(255,253,249,.72); font-size: .76rem; }
    .availability-note { margin-top: 1rem; color: rgba(255,253,249,.68); font-size: .82rem; }
    @media (min-width: 760px) {
      .maker-grid { grid-template-columns: .92fr 1.08fr; gap: 1.6rem; }
      .maker-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .maker-fact:first-child { grid-column: 1 / -1; }
      .city-grid { gap: .85rem; }
      .city-card { min-height: 98px; padding: 1rem; }
    }
    @media (max-width: 360px) { .city-grid { grid-template-columns: 1fr; } }
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
        <p>Product details, maker information, and the places where you can find Khamaruzz Nadan Achaar.</p>
      </header>
      <div class="maker-grid">
        <article class="maker-card" aria-labelledby="maker-details-title">
          <span class="maker-brand">Khamaruzz Nadan Achaar</span>
          <h3 id="maker-details-title">Proudly made in Kerala</h3>
          <address class="maker-address">
            <strong>Manufactured by:</strong><br>
            Khamaruzz Nadan Achaar<br>
            Vazakkam Vettil, Behind KMR Steels,<br>
            Ulleryi 19, Atholi, Kozhikode,<br>
            Kerala – 673612, India.
          </address>
          <dl class="maker-facts">
            <div class="maker-fact"><dt>FSSAI Licence No.</dt><dd>21326239000445</dd></div>
            <div class="maker-fact"><dt>Country of Origin</dt><dd>India</dd></div>
          </dl>
        </article>
        <section class="availability-card" aria-labelledby="availability-title">
          <p class="india-motif">From Kerala, across India</p>
          <h3 id="availability-title">Where to Find Us</h3>
          <p class="availability-intro">Find Khamaruzz Nadan Achaar in these locations.</p>
          <div class="city-grid" role="list" aria-label="Product availability locations">
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Kerala</strong><span>God's Own Country</span></span></div>
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Bengaluru</strong><span>The Garden City</span></span></div>
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Mumbai</strong><span>The City of Dreams</span></span></div>
            <div class="city-card" role="listitem"><span class="city-mark" aria-hidden="true">✦</span><span><strong>Delhi</strong><span India's capital</span></span></div>
          </div>
          <p class="availability-note">Availability locations only; no individual shops or distribution partners are listed.</p>
        </section>
      </div>
    </div>`;

  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);
  const about = document.getElementById("about");
  if (about) about.insertAdjacentElement("afterend", section);
})();
