document.addEventListener("DOMContentLoaded", function () {
  // ===== HAMBURGER MENU =====
  // Wait for the page to fully load, then find the menu button and navigation menu
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    // When click hamburger menu, show or hide navigation menu
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("is-open");
    });
  }

  // ===== LOAD PRODUCTS FROM JSON =====
  const featuredGrid = document.getElementById("productsGrid");
  const shopGrid = document.getElementById("shopGrid");

  if (featuredGrid) {
    loadProducts("assets/data/featuredPC.json", featuredGrid);
  }

  if (shopGrid) {
    // load all products (PCs, graphics cards, etc.)
    loadShopProducts();
  }

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
});

// Handle form submission
// stops form from submitting and checks all validations
function handleFormSubmit(formEvent) {
  formEvent.preventDefault();

  // get form values and remove extra whitespace
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // check if any required field is empty
  if (!name || !email || !subject || !message) {
    showError("Please fill out all required fields.");
    return;
  }

  // check name length (at least 3 characters)
  if (name.length < 3) {
    showError("Name must be at least 3 characters.");
    return;
  }

  // check name has no numbers
  if (/\d/.test(name)) {
    showError("Name cannot contain numbers.");
    return;
  }

  // check email has @ symbol and dot
  if (!email.includes("@") || !email.includes(".")) {
    showError("Please enter a valid email address.");
    return;
  }

  // check message length (at least 10 characters)
  if (message.length < 10) {
    showError("Message must be at least 10 characters.");
    return;
  }

  // if all checks pass, show success
  showSuccess("Message sent successfully!");
  document.getElementById("contactForm").reset();
}

// Show error message
// displays red error message at top of form
function showError(message) {
  const contactForm = document.getElementById("contactForm");
  removeMessage();

  const errorDiv = document.createElement("div");
  errorDiv.className = "form-message error-message";
  errorDiv.textContent = message;

  contactForm.insertBefore(errorDiv, contactForm.firstChild);

  // auto-remove message after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Show success message
// displays green success message at top of form
function showSuccess(message) {
  const contactForm = document.getElementById("contactForm");
  removeMessage();

  const successDiv = document.createElement("div");
  successDiv.className = "form-message success-message";
  successDiv.textContent = message;

  contactForm.insertBefore(successDiv, contactForm.firstChild);

  // auto-remove message after 8 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 8000);
}

// Remove existing message
// clears old error or success message before showing new one
function removeMessage() {
  const existing = document.querySelector(".form-message");
  if (existing) {
    existing.remove();
  }
}

// === Load featured products (for index.html) ===
// reads product data from a JSON file and shows 4 random ones
async function loadProducts(jsonFile, gridElement) {
  try {
    // grab file from server
    const response = await fetch(jsonFile);
    // convert file to use
    const data = await response.json();
    let products = data.products;

    if (!gridElement) return;

    // pick 4 random products to display
    products = getRandomProducts(products, 4);

    // loop through each product and create a card to display it
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      // builds the HTML that shows the product image, name, specs, and price
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
          <div class="product-price">${product.price}</div>
        </div>
      `;

      // add card to the grid on the page
      gridElement.appendChild(card);
    });
  } catch (error) {
    // error message if something goes wrong
    console.error("Error loading products:", error);
    if (gridElement) {
      gridElement.innerHTML =
        '<p style="color: white;">Error loading products</p>';
    }
  }
}

// Get random products from array
// basically shuffles the products and picks the first however many you ask for
function getRandomProducts(products, count) {
  // copy of the array so it dont mess up the original
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  // return only the first "count" items
  return shuffled.slice(0, count);
}

// === Load all shop products (for shop.html) ===
async function loadShopProducts() {
  // list of all product categories and data
  const jsonFiles = [
    { name: "Prebuilds", file: "assets/data/featuredPC.json" },
    { name: "Graphics Cards", file: "assets/data/graphicsCards.json" },
    { name: "Motherboards", file: "assets/data/motherboards.json" },
    { name: "CPUs", file: "assets/data/cpus.json" },
  ];

  const shopGrid = document.getElementById("shopGrid");
  if (!shopGrid) return;

  // store all products in memory so it can be sorted later without reloading
  window.allProducts = {};

  for (const category of jsonFiles) {
    try {
      // fetch the json file for a category
      const response = await fetch(category.file);
      const data = await response.json();
      const products = data.products;

      // save the products so it can be sorted
      window.allProducts[category.name] = products;

      // create a section on the page for this category
      const categorySection = document.createElement("div");
      categorySection.className = "category-section";
      // give it an ID based on the category name (for easy linking)
      categorySection.id = `category-${category.name
        .replace(/\s+/g, "-")
        .toLowerCase()}`;

      // add the category title (like "Graphics Cards")
      const categoryTitle = document.createElement("h3");
      categoryTitle.className = "category-title";
      categoryTitle.textContent = category.name;
      categorySection.appendChild(categoryTitle);

      // create a grid to hold all the products in this category
      const categoryGrid = document.createElement("div");
      categoryGrid.className = "products-grid";
      // remember which category this grid belongs to (useful for sorting)
      categoryGrid.dataset.category = category.name;

      // draw the product cards in grid
      renderProducts(products, categoryGrid);

      categorySection.appendChild(categoryGrid);
      shopGrid.appendChild(categorySection);
    } catch (error) {
      // if can't load a category, catch the error
      console.error(`Error loading ${category.name}:`, error);
    }
  }
}

// Render products in grid
// takes a list of products and makes them as cards in a container
function renderProducts(products, gridElement) {
  // clear out any old products that might be there
  gridElement.innerHTML = "";

  // loop through each product and create a card for it
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // build the HTML showing product image, name, specs, and price
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
        <div class="product-price">${product.price}</div>
      </div>
    `;

    // add card to the grid
    gridElement.appendChild(card);
  });
}

// === Sort products function ===
// lets the user organize products by price (low to high or high to low)
function sortProducts(sortBy) {
  const grids = document.querySelectorAll(".products-grid");

  grids.forEach((grid) => {
    const category = grid.dataset.category;
    // make a copy of the products so it can be rearranged without breaking anything
    let products = [...window.allProducts[category]];

    // sort based on what the user chose
    if (sortBy === "price-low") {
      // sort from low to most expensive
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      // sort from most expensive to low
      products.sort((a, b) => b.price - a.price);
    }

    // redo the products in their new sorted order
    renderProducts(products, grid);
  });
}
