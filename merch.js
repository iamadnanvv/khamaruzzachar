(function () {
  "use strict";

  var WHATSAPP_NUMBER = "919656778508";
  var CART_KEY = "khamaruzz-merch-cart";

  /* ---------- Mobile nav ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Cart state ---------- */
  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  var cart = loadCart();

  function findLine(id, color, size) {
    return cart.find(function (l) { return l.id === id && l.color === color && l.size === size; });
  }

  function addToCart(id, name, price, color, size) {
    var line = findLine(id, color, size);
    if (line) { line.qty += 1; }
    else { cart.push({ id: id, name: name, price: price, color: color || "", size: size || "", qty: 1 }); }
    saveCart(cart);
    renderCart();
    showToast(name + " added to cart");
  }

  function updateQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }

  function removeLine(index) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }

  function cartTotal() {
    return cart.reduce(function (sum, l) { return sum + l.price * l.qty; }, 0);
  }
  function cartCount() {
    return cart.reduce(function (sum, l) { return sum + l.qty; }, 0);
  }

  /* ---------- Render cart ---------- */
  var cartItemsEl = document.getElementById("cartItems");
  var cartSubtotalEl = document.getElementById("cartSubtotal");
  var cartBadge = document.getElementById("cartBadge");
  var cartCheckoutBtn = document.getElementById("cartCheckoutBtn");
  var formCartNotice = document.getElementById("formCartNotice");

  function renderCart() {
    var count = cartCount();
    var total = cartTotal();

    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.hidden = count === 0;
    }
    if (cartSubtotalEl) cartSubtotalEl.textContent = "\u20B9" + total;
    if (cartCheckoutBtn) cartCheckoutBtn.disabled = count === 0;

    if (cartItemsEl) {
      cartItemsEl.innerHTML = "";
      if (cart.length === 0) {
        var empty = document.createElement("p");
        empty.className = "drawer-empty";
        empty.textContent = "Your cart is empty. Go pick something off the shelf.";
        cartItemsEl.appendChild(empty);
      } else {
        cart.forEach(function (line, index) {
          var row = document.createElement("div");
          row.className = "cart-line";
          var meta = [line.color, line.size].filter(Boolean).join(" \u00B7 ");
          row.innerHTML =
            '<div class="cart-line-info">' +
              "<h4>" + line.name + "</h4>" +
              (meta ? "<span>" + meta + "</span>" : "") +
              "<span>\u20B9" + line.price + " each</span>" +
            "</div>" +
            '<div class="cart-line-qty">' +
              '<button type="button" data-dec>\u2212</button>' +
              "<span>" + line.qty + "</span>" +
              '<button type="button" data-inc>+</button>' +
            "</div>";
          var dec = row.querySelector("[data-dec]");
          var inc = row.querySelector("[data-inc]");
          dec.addEventListener("click", function () { updateQty(index, -1); });
          inc.addEventListener("click", function () { updateQty(index, 1); });

          var removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "cart-line-remove";
          removeBtn.textContent = "Remove";
          removeBtn.addEventListener("click", function () { removeLine(index); });
          row.querySelector(".cart-line-qty").appendChild(removeBtn);

          cartItemsEl.appendChild(row);
        });
      }
    }

    if (formCartNotice) {
      formCartNotice.hidden = count === 0;
      var countSpan = formCartNotice.querySelector("[data-cart-count]");
      var totalSpan = formCartNotice.querySelector("[data-cart-total]");
      if (countSpan) countSpan.textContent = count;
      if (totalSpan) totalSpan.textContent = "\u20B9" + total;
    }
  }

  /* ---------- Add to cart buttons ---------- */
  document.querySelectorAll("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".product-card");
      var id = btn.getAttribute("data-add");
      var name = btn.getAttribute("data-name");
      var price = parseFloat(btn.getAttribute("data-price"));
      var colorSel = card.querySelector('[data-opt="color"]');
      var sizeSel = card.querySelector('[data-opt="size"]');
      addToCart(id, name, price, colorSel ? colorSel.value : "", sizeSel ? sizeSel.value : "");
    });
  });

  /* ---------- Drawer open/close ---------- */
  var overlay = document.getElementById("drawerOverlay");
  var cartDrawer = document.getElementById("cartDrawer");

  function openDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeDrawers() {
    [cartDrawer].forEach(function (d) {
      if (!d) return;
      d.classList.remove("open");
      d.setAttribute("aria-hidden", "true");
    });
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () { openDrawer(cartDrawer); });
  });
  if (overlay) overlay.addEventListener("click", closeDrawers);
  document.querySelectorAll(".drawer-close").forEach(function (btn) {
    btn.addEventListener("click", closeDrawers);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawers();
  });

  var clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", function () {
      cart = [];
      saveCart(cart);
      renderCart();
      showToast("Cart cleared");
    });
  }

  /* ---------- WhatsApp checkout from drawer ---------- */
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", function () {
      if (cart.length === 0) return;
      var lines = cart.map(function (l) {
        var meta = [l.color, l.size].filter(Boolean).join(", ");
        return "\u2022 " + l.name + (meta ? " (" + meta + ")" : "") + " x" + l.qty + " \u2014 \u20B9" + (l.price * l.qty);
      });
      var msg = "Hi Khamaruzz! I'd like to order:\n" + lines.join("\n") + "\n\nTotal: \u20B9" + cartTotal();
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  /* ---------- Toast ---------- */
  var toastRoot = document.getElementById("toastRoot");
  function showToast(text) {
    if (!toastRoot) return;
    var el = document.createElement("div");
    el.className = "toast-item";
    el.textContent = text;
    toastRoot.appendChild(el);
    setTimeout(function () { el.remove(); }, 2200);
  }

  /* ---------- Order form -> WhatsApp ---------- */
  var orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fullName = document.getElementById("fullName").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var product = document.getElementById("formProduct") ? document.getElementById("formProduct").value : "";
      var size = document.getElementById("formSize") ? document.getElementById("formSize").value.trim() : "";
      var address = document.getElementById("address").value.trim();
      var notes = document.getElementById("notes").value.trim();

      var lines = [];
      lines.push("Hi Khamaruzz! I'd like to place a merch order.");
      lines.push("");
      lines.push("Name: " + fullName);
      lines.push("Phone: " + phone);

      if (cart.length > 0) {
        lines.push("");
        lines.push("Cart items:");
        cart.forEach(function (l) {
          var meta = [l.color, l.size].filter(Boolean).join(", ");
          lines.push("\u2022 " + l.name + (meta ? " (" + meta + ")" : "") + " x" + l.qty + " \u2014 \u20B9" + (l.price * l.qty));
        });
        lines.push("Cart Total: \u20B9" + cartTotal());
      } else if (product) {
        lines.push("Item: " + product + (size ? " (" + size + ")" : ""));
      }

      lines.push("");
      lines.push("Delivery Address: " + address);
      if (notes) lines.push("Notes: " + notes);

      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Init ---------- */
  renderCart();
})();
