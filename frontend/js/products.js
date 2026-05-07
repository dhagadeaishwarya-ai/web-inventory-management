function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[character];
  });
}

const productForm = document.getElementById("productForm");

if (productForm) {
  productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const product = {
      name: document.getElementById("productName").value.trim(),
      sku: document.getElementById("sku").value.trim(),
      quantity: Number(document.getElementById("quantity").value),
      price: Number(document.getElementById("price").value),
      category: document.getElementById("category").value,
      supplier: document.getElementById("supplier").value.trim(),
      dateAdded: document.getElementById("dateAdded").value,
    };

    const products = getProducts();
    const skuExists = products.some(function (existingProduct) {
      return existingProduct.sku.toLowerCase() === product.sku.toLowerCase();
    });

    if (skuExists) {
      alert("A product with this SKU already exists.");
      return;
    }

    products.push(product);
    saveProducts(products);

    alert("Product added successfully");
    productForm.reset();
    window.location.href = "products.html";
  });
}

const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

if (productTableBody) {
  const products = getProducts();

  function displayProducts(productList) {
    productTableBody.innerHTML = "";

    if (productList.length === 0) {
      productTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">No products found</td>
        </tr>
      `;
      return;
    }

    productList.forEach(function (product) {
      const row = `
        <tr>
          <td>${escapeHtml(product.name)}</td>
          <td>${escapeHtml(product.sku)}</td>
          <td>
            ${product.quantity}
            ${product.quantity <= 5 ? '<span class="badge text-bg-danger">Low</span>' : ""}
          </td>
          <td>Rs. ${product.price}</td>
          <td>${escapeHtml(product.category)}</td>
          <td>${escapeHtml(product.supplier)}</td>
          <td>${escapeHtml(product.dateAdded)}</td>
          <td>
            <button class="btn btn-sm btn-warning" type="button" data-action="edit" data-sku="${escapeHtml(product.sku)}">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" type="button" data-action="delete" data-sku="${escapeHtml(product.sku)}">
              Delete
            </button>
          </td>
        </tr>
      `;

      productTableBody.innerHTML += row;
    });
  }

  function filterProducts() {
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "";

    const filteredProducts = products.filter(function (product) {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.sku.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
  }

  displayProducts(products);

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
  }

  productTableBody.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const sku = button.dataset.sku;

    if (button.dataset.action === "delete") {
      deleteProduct(sku);
    }

    if (button.dataset.action === "edit") {
      editProduct(sku);
    }
  });
}

function deleteProduct(sku) {
  const products = getProducts();
  const updatedProducts = products.filter(function (product) {
    return product.sku !== sku;
  });

  saveProducts(updatedProducts);
  location.reload();
}

function editProduct(sku) {
  alert(`Edit will be added in the next step for SKU: ${sku}`);
}

const totalProducts = document.getElementById("totalProducts");
const lowStockItems = document.getElementById("lowStockItems");
const inventoryValue = document.getElementById("inventoryValue");
const recentProductsBody = document.getElementById("recentProductsBody");

if (totalProducts && lowStockItems && inventoryValue && recentProductsBody) {
  const products = getProducts();

  totalProducts.textContent = products.length;

  const lowStockCount = products.filter(function (product) {
    return product.quantity <= 5;
  }).length;

  lowStockItems.textContent = lowStockCount;

  const totalValue = products.reduce(function (total, product) {
    return total + product.quantity * product.price;
  }, 0);

  inventoryValue.textContent = `Rs. ${totalValue}`;

  recentProductsBody.innerHTML = "";

  const recentProducts = products.slice(-5).reverse();

  if (recentProducts.length === 0) {
    recentProductsBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">No products added yet</td>
      </tr>
    `;
  }

  recentProducts.forEach(function (product) {
    const row = `
      <tr>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(product.sku)}</td>
        <td>
          ${product.quantity}
          ${product.quantity <= 5 ? '<span class="badge text-bg-danger">Low</span>' : ""}
        </td>
        <td>Rs. ${product.price}</td>
        <td>${escapeHtml(product.category)}</td>
      </tr>
    `;

    recentProductsBody.innerHTML += row;
  });
}
