document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      // 1. Toggles the 'is-open' class on the <nav>
      mainNav.classList.toggle("is-open");

      // 2. Toggles ARIA for accessibility (changes the 'false' to 'true' and vice versa)
      let isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ===== HAMBURGER MENU =====
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("is-open");

      let isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
    });
  }

  // ===== LOAD PRODUCTS FROM JSON =====
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch("/assets/data/products.json");
    const data = await response.json();
    const products = data.products;
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          ${
            product.image
              ? `<img src="${product.image}" alt="${product.name}">`
              : "<span>No Image</span>"
          }
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-specs">${product.specs}</div>
          <div class="product-price">$${product.price}</div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading products:", error);
    const grid = document.getElementById("productsGrid");
    if (grid) {
      grid.innerHTML = '<p style="color: white;">Error loading products</p>';
    }
  }
}
