(function () {
  "use strict";

  const WHATSAPP_NUMBER = "919645778508";
  const STORAGE_CART = "khamaruzz_cart";
  const STORAGE_FAV = "khamaruzz_favorites";

  function roundAmount(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function buildWeightPrices(basePrice) {
    return {
      "250g": roundAmount(basePrice),
      "500g": roundAmount(basePrice * 1.4),
      "1kg": roundAmount(basePrice * 2.8)
    };
  }

  const PRODUCTS = {
    mango: {
      name: "Mango Pickle",
      image: "mango.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 18, "500g": 12, "1kg": 6 }
    },
    garlic: {
      name: "Garlic Pickle",
      image: "garlic.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 15, "500g": 10, "1kg": 5 }
    },
    dates: {
      name: "Dates Pickle",
      image: "dates.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 12, "500g": 8, "1kg": 4 }
    },
    "chicken-kondattam": {
      name: "Chicken Kondattam",
      image: "chicken-kondattam.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 10, "500g": 7, "1kg": 3 }
    },
    "normal-kondattam": {
      name: "Normal Kondattam",
      image: "normal-kondattam.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 14, "500g": 10, "1kg": 5 }
    },
    chemmeen: {
      name: "Chemmeen Achaar",
      image: "chemmeen.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 8, "500g": 6, "1kg": 3 }
    },
    "mix-fruits": {
      name: "Mix Fruits Achaar",
      image: "mix-fruits.png",
      priceBase: 270,
      prices: buildWeightPrices(270),
      stock: { "250g": 9, "500g": 7, "1kg": 3 }
    }
  };

  const PRODUCT_BY_NAME = Object.fromEntries(
    Object.entries(PRODUCTS).map(([id, p]) => [p.name, id])
  );

  function formatPrice(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  function getProductPrice(productId, size) {
    const product = PRODUCTS[productId];
    if (!product) return 0;
    const pricing = product.prices || {};
    if (pricing[size] != null) return Number(pricing[size]);
    const base = Number(product.priceBase || Object.values(pricing)[0] || 270);
    if (size === "500g") return roundAmount(base * 1.4);
    if (size === "1kg") return roundAmount(base * 2.8);
    return roundAmount(base);
  }

  function getSelectedQty(card) {
    const input = card?.querySelector(".qty-input");
    if (!input) return 1;
    const parsed = Number.parseInt(input.value, 10);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.min(20, parsed);
  }

  function openWhatsApp(message) {
    window.open(
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
      "_blank",
      "noopener,noreferrer"
    );
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* quota exceeded */ }
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  let cart = loadJson(STORAGE_CART, []);

  function saveCart() {
    saveJson(STORAGE_CART, cart);
    renderCart();
    updateBadges();
    updateOrderFormMode();
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => {
      const product = PRODUCTS[item.productId];
      return sum + (product ? getProductPrice(item.productId, item.size) * item.qty : 0);
    }, 0);
  }

  function addToCart(productId, size, qty = 1) {
    if (!PRODUCTS[productId] || !PRODUCTS[productId].prices[size]) return;
    const stock = PRODUCTS[productId].stock?.[size] ?? Infinity;
    const allowedQty = Math.min(Math.max(qty, 1), stock);
    const key = productId + "::" + size;
    const existing = cart.find((i) => i.key === key);
    if (existing) {
      existing.qty = Math.min(existing.qty + allowedQty, stock || existing.qty + allowedQty);
    } else {
      cart.push({ key, productId, size, qty: allowedQty });
    }
    saveCart();
    showToast(PRODUCTS[productId].name + " (" + size + ") added to cart");
  }

  function updateCartQty(key, delta) {
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.key !== key);
    }
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    showToast("Cart cleared");
  }

  let favorites = loadJson(STORAGE_FAV, []);

  function toggleFavorite(productId) {
    const idx = favorites.indexOf(productId);
    if (idx === -1) {
      favorites.push(productId);
      showToast(PRODUCTS[productId].name + " saved to favorites");
    } else {
      favorites.splice(idx, 1);
      showToast(PRODUCTS[productId].name + " removed from favorites");
    }
    saveJson(STORAGE_FAV, favorites);
    updateFavoritesUI();
    updateBadges();
  }

  const header = document.getElementById("header");
  const cartBadge = document.getElementById("cartBadge");
  const favBadge = document.getElementById("favBadge");
  const cartDrawer = document.getElementById("cartDrawer");
  const favoritesDrawer = document.getElementById("favoritesDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const toastRoot = document.getElementById("toast");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const formProduct = document.getElementById("formProduct");
  const formSize = document.getElementById("formSize");
  const formProductRow = document.getElementById("formProductRow");

  let toastTimer = null;

  function updateBadges() {
    const count = getCartCount();
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.hidden = count === 0;
    }
    if (favBadge) {
      favBadge.textContent = favorites.length;
      favBadge.hidden = favorites.length === 0;
    }
    document.querySelectorAll("[data-favorite]").forEach((btn) => {
      btn.classList.toggle("is-active", favorites.includes(btn.dataset.favorite));
    });
  }

  function showToast(msg) {
    if (!toastRoot) return;
    clearTimeout(toastTimer);
    toastRoot.textContent = msg;
    toastRoot.classList.add("is-visible");
    toastTimer = setTimeout(() => toastRoot.classList.remove("is-visible"), 2800);
  }

  function lockBodyScroll(lock) {
    document.body.classList.toggle("drawer-open", lock);
  }

  function openDrawer(drawer) {
    closeMobileMenu();
    if (drawerOverlay) {
      drawerOverlay.hidden = false;
      requestAnimationFrame(() => drawerOverlay.style.opacity = "1");
    }
    if (drawer) {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
    }
    lockBodyScroll(true);
  }

  function closeDrawers() {
    if (drawerOverlay) drawerOverlay.hidden = true;
    [cartDrawer, favoritesDrawer].forEach((d) => {
      if (d) {
        d.classList.remove("is-open");
        d.setAttribute("aria-hidden", "true");
      }
    });
    if (!mobileNav || !mobileNav.classList.contains("is-open")) {
      lockBodyScroll(false);
    }
  }

  function renderCart() {
    const cartItemsEl = document.getElementById("cartItems");
    const cartSubtotalEl = document.getElementById("cartSubtotal");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");
    if (!cartItemsEl) return;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="drawer-empty">Your cart is empty.</p>';
      if (cartSubtotalEl) cartSubtotalEl.textContent = "₹0";
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartItemsEl.innerHTML = cart.map((item) => {
      const product = PRODUCTS[item.productId];
      if (!product) return "";
      const unitPrice = getProductPrice(item.productId, item.size);
      const totalPrice = unitPrice * item.qty;
      return `
        <div class="cart-item">
          <div>
            <h4>${product.name}</h4>
            <p class="cart-item-meta">${item.size} — ${formatPrice(unitPrice)} each</p>
            <div class="cart-qty-controls">
              <button type="button" class="btn-qty" data-cart-dec="${item.key}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button type="button" class="btn-qty" data-cart-inc="${item.key}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <strong class="cart-item-price">${formatPrice(totalPrice)}</strong>
        </div>`;
    }).join("");

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(getCartSubtotal());

    cartItemsEl.querySelectorAll("[data-cart-inc]").forEach((btn) => {
      btn.addEventListener("click", () => updateCartQty(btn.dataset.cartInc, 1));
    });
    cartItemsEl.querySelectorAll("[data-cart-dec]").forEach((btn) => {
      btn.addEventListener("click", () => updateCartQty(btn.dataset.cartDec, -1));
    });
  }

  function updateFavoritesUI() {
    const favItemsEl = document.getElementById("favoritesItems");
    if (!favItemsEl) return;

    if (favorites.length === 0) {
      favItemsEl.innerHTML = '<p class="drawer-empty">No saved favorites yet.</p>';
      return;
    }

    favItemsEl.innerHTML = favorites.map((pid) => {
      const product = PRODUCTS[pid];
      if (!product) return "";
      const startPrice = getProductPrice(pid, Object.keys(product.prices)[0]);
      return `
        <div class="fav-item">
          <div>
            <h4>${product.name}</h4>
            <p class="fav-item-meta">Starting at ${formatPrice(startPrice)}</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" data-fav-add="${pid}">Add to Cart</button>
        </div>`;
    }).join("");

    favItemsEl.querySelectorAll("[data-fav-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.dataset.favAdd;
        const size = Object.keys(PRODUCTS[pid].prices)[0];
        addToCart(pid, size, 1);
      });
    });
  }

  function populateFormProducts() {
    if (!formProduct) return;
    const current = formProduct.value;
    formProduct.innerHTML =
      '<option value="">Choose a pickle</option>' +
      Object.values(PRODUCTS).map((product) => `<option value="${product.name}">${product.name}</option>`).join("");
    if (current && PRODUCT_BY_NAME[current]) formProduct.value = current;
  }

  function populateFormSizes(productId) {
    if (!formSize) return;
    if (!productId || !PRODUCTS[productId]) {
      formSize.innerHTML = '<option value="">Select product first</option>';
      formSize.disabled = true;
      return;
    }

    const product = PRODUCTS[productId];
    formSize.innerHTML = Object.keys(product.prices)
      .map((size) => {
        const stock = product.stock?.[size] ?? Infinity;
        const isDisabled = stock <= 0 ? "disabled" : "";
        const label = `${size} — ${formatPrice(getProductPrice(productId, size))}`;
        return `<option value="${size}" ${isDisabled}>${label}${stock <= 0 ? " (Out of stock)" : ""}</option>`;
      })
      .join("");
    formSize.disabled = false;
  }

  function updateOrderFormMode() {
    const notice = document.getElementById("formCartNotice");
    const count = getCartCount();
    const hasCart = count > 0;

    if (notice) {
      notice.hidden = !hasCart;
      if (hasCart) {
        notice.querySelector("[data-cart-count]").textContent = count;
        notice.querySelector("[data-cart-total]").textContent = formatPrice(getCartSubtotal());
      }
    }

    if (formProductRow) {
      formProductRow.hidden = hasCart;
    }
    if (formProduct) {
      formProduct.required = !hasCart;
    }
    if (formSize) {
      formSize.required = !hasCart && !!formProduct && !!formProduct.value;
    }
  }

  function openMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    lockBodyScroll(true);
  }

  function closeMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    if (!mobileNav.classList.contains("is-open")) return;
    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    if (!cartDrawer?.classList.contains("is-open") && !favoritesDrawer?.classList.contains("is-open")) {
      lockBodyScroll(false);
    }
  }

  function toggleMobileMenu() {
    if (menuToggle?.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function initHeaderScroll() {
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initScrollReveal() {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    if (prefersReducedMotion()) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function initHeroParallax() {
    if (prefersReducedMotion()) return;
    const heroImg = document.querySelector(".hero-image");
    if (!heroImg) return;

    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = "translateY(" + y * 0.08 + "px)";
        }
      },
      { passive: true }
    );
  }

  function initWhatsAppWidget() {
    const widget = document.getElementById("widgetify-whatsapp");
    const popup = document.getElementById("widgetify-popup");
    const closeBtn = document.getElementById("widgetifyClose");
    const input = document.getElementById("widgetifyInput");
    const sendBtn = document.getElementById("widgetifySend");
    if (!widget || !popup) return;

    function togglePopup(force) {
      const open = typeof force === "boolean" ? force : !popup.classList.contains("show");
      popup.classList.toggle("show", open);
      popup.setAttribute("aria-hidden", open ? "false" : "true");
      widget.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && input) input.focus();
    }

    widget.addEventListener("click", () => togglePopup());
    closeBtn?.addEventListener("click", () => togglePopup(false));

    function sendMessage() {
      const text = (input?.value.trim()) || "Hi! I'd like to know more about Khamaruzz Naadan Achaar.";
      openWhatsApp(text);
      togglePopup(false);
      if (input) input.value = "";
    }

    sendBtn?.addEventListener("click", sendMessage);
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

    document.addEventListener("click", (e) => {
      if (popup.classList.contains("show") && !popup.contains(e.target) && !widget.contains(e.target)) {
        togglePopup(false);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    populateFormProducts();
    updateBadges();
    updateFavoritesUI();
    renderCart();
    updateOrderFormMode();
    initHeaderScroll();
    initScrollReveal();
    initHeroParallax();
    initWhatsAppWidget();

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.querySelectorAll(".product-card").forEach((card) => {
      const pid = card.dataset.product;
      const select = card.querySelector(".product-size");
      const priceEl = card.querySelector(".product-price");
      const qtyInput = card.querySelector(".qty-input");
      const minus = card.querySelector("[data-qty-minus]");
      const plus = card.querySelector("[data-qty-plus]");

      const updatePriceDisplay = () => {
        if (!pid || !select || !priceEl) return;
        const activeSize = select.value;
        const unitPrice = getProductPrice(pid, activeSize);
        priceEl.textContent = formatPrice(unitPrice);
      };

      select?.addEventListener("change", updatePriceDisplay);

      minus?.addEventListener("click", () => {
        const current = Number.parseInt(qtyInput?.value || "1", 10) || 1;
        const next = Math.max(1, current - 1);
        if (qtyInput) qtyInput.value = String(next);
      });

      plus?.addEventListener("click", () => {
        const current = Number.parseInt(qtyInput?.value || "1", 10) || 1;
        const next = Math.min(20, current + 1);
        if (qtyInput) qtyInput.value = String(next);
      });

      qtyInput?.addEventListener("input", () => {
        if (!qtyInput.value) return;
        const next = Math.min(20, Math.max(1, Number.parseInt(qtyInput.value, 10) || 1));
        qtyInput.value = String(next);
      });

      updatePriceDisplay();
    });

    document.querySelectorAll("[data-add-cart]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.dataset.addCart;
        const card = btn.closest(".product-card");
        const select = card?.querySelector(".product-size");
        const size = select ? select.value : Object.keys(PRODUCTS[pid].prices)[0];
        const quantity = getSelectedQty(card);
        addToCart(pid, size, quantity);
      });
    });

    document.querySelectorAll(".product-order").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.dataset.product;
        const card = btn.closest(".product-card");
        const select = card?.querySelector(".product-size");
        const size = select ? select.value : Object.keys(PRODUCTS[pid].prices)[0];
        const quantity = getSelectedQty(card);
        addToCart(pid, size, quantity);
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("fullName")?.focus({ preventScroll: true });
      });
    });

    document.querySelectorAll("[data-wa-default]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openWhatsApp("Hi! I would like to inquire about ordering Khamaruzz Naadan Achaar.");
      });
    });

    document.querySelectorAll("[data-favorite]").forEach((btn) => {
      btn.addEventListener("click", () => toggleFavorite(btn.dataset.favorite));
    });

    document.querySelectorAll("[data-open-cart]").forEach((b) =>
      b.addEventListener("click", () => { renderCart(); openDrawer(cartDrawer); })
    );
    document.querySelectorAll("[data-open-favorites]").forEach((b) =>
      b.addEventListener("click", () => { updateFavoritesUI(); openDrawer(favoritesDrawer); })
    );
    document.querySelectorAll(".drawer-close").forEach((b) =>
      b.addEventListener("click", closeDrawers)
    );
    drawerOverlay?.addEventListener("click", closeDrawers);

    document.getElementById("clearCartBtn")?.addEventListener("click", clearCart);

    document.getElementById("cartCheckoutBtn")?.addEventListener("click", () => {
      if (cart.length === 0) return;
      closeDrawers();
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("fullName")?.focus({ preventScroll: true });
    });

    menuToggle?.addEventListener("click", toggleMobileMenu);
    mobileNav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
    mobileNav?.querySelectorAll("[data-open-cart], [data-open-favorites]").forEach((btn) => {
      btn.addEventListener("click", closeMobileMenu);
    });

    formProduct?.addEventListener("change", (e) => {
      populateFormSizes(PRODUCT_BY_NAME[e.target.value]);
      updateOrderFormMode();
    });

    const orderForm = document.getElementById("checkoutForm") || document.getElementById("orderForm");
    const trimmedRequiredFields = [
      { input: document.getElementById("fullName"), message: "Please enter your full name." },
      { input: document.getElementById("address"), message: "Please enter your complete delivery address." }
    ];

    trimmedRequiredFields.forEach(({ input }) => {
      input?.addEventListener("input", () => input.setCustomValidity(""));
    });

    orderForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      let hasBlankRequiredField = false;
      trimmedRequiredFields.forEach(({ input, message }) => {
        if (!input) return;
        const isBlank = !input.value.trim();
        input.setCustomValidity(isBlank ? message : "");
        hasBlankRequiredField = hasBlankRequiredField || isBlank;
      });
      if (hasBlankRequiredField) {
        orderForm.reportValidity();
        return;
      }

      const name = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const pinCode = document.getElementById("pinCode").value.trim();
      const notes = document.getElementById("notes").value.trim();

      let msg = "*New Customer Order*\n\n*Name:* " + name +
        "\n*Phone:* " + phone +
        "\n*Email:* " + email +
        "\n*Complete Delivery Address:* " + address +
        "\n*PIN Code:* " + pinCode + "\n";
      if (notes) msg += "*Notes:* " + notes + "\n";

      if (cart.length > 0) {
        msg += "\n*Cart Items:*\n" + cart.map((item) => {
          const product = PRODUCTS[item.productId];
          const lineTotal = getProductPrice(item.productId, item.size) * item.qty;
          return "- " + product.name + " (" + item.size + ") x" + item.qty +
            " — " + formatPrice(lineTotal);
        }).join("\n");
        msg += "\n\n*Total Amount:* " + formatPrice(getCartSubtotal());
      } else if (formProduct?.value) {
        const selectedValue = formProduct.value;
        const selectedSize = formSize?.value || "250g";
        const product = PRODUCT_BY_NAME[selectedValue] ? PRODUCTS[PRODUCT_BY_NAME[selectedValue]] : null;
        const basePrice = product ? getProductPrice(PRODUCT_BY_NAME[selectedValue], selectedSize) : 0;
        msg += "\n*Selected Product:* " + selectedValue + " (" + selectedSize + ")\n*Unit Price:* " + formatPrice(basePrice);
      }

      openWhatsApp(msg);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawers();
        closeMobileMenu();
        document.getElementById("widgetify-popup")?.classList.remove("show");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  });
})();
