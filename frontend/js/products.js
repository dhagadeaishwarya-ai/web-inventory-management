const API_URL = "http://localhost:5000/products";
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");


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
  if (editId) {
  async function loadProductForEdit() {
    const response = await fetch(`${API_URL}/${editId}`);
    
    if (!response.ok) {
      alert("Product not found");
      return;
    }
    const product = await response.json();
    document.getElementById("productName").value = product.name;
    document.getElementById("sku").value = product.sku || "";
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("supplier").value = product.supplier;
    document.getElementById("dateAdded").value = product.dateAdded.split("T")[0];
  }

  loadProductForEdit();
}

  productForm.addEventListener("submit",async function (event) {
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

  const url = editId ? `${API_URL}/${editId}` : API_URL;
const method = editId ? "PUT" : "POST";

const response = await fetch(url, {
  method: method,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeaders()
  },
  body: JSON.stringify(product),
});

if (!response.ok) {
  alert(editId ? "Failed to update product" : "Failed to add product");
  return;
}



    alert(editId ? "Product updated successfully" : "Product added successfully");
    productForm.reset();
    window.location.href = "products.html";
  });
}

const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

if (productTableBody) {
  let products = [];

  async function loadProducts() {
    const response = await fetch(API_URL,{
      headers: getAuthHeaders(),
    });
    products = await response.json();
    displayProducts(products);
  }
  loadProducts();

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
            <button class="btn btn-sm btn-warning" type="button" data-action="edit" data-id="${product._id}">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" type="button" data-action="delete" data-id="${product._id}">
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

    const id = button.dataset.id;

    if (button.dataset.action === "delete") {
      deleteProduct(id);
    }

    if (button.dataset.action === "edit") {
      editProduct(id);
    }
  });
}

async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
  });

  if (!response.ok) {
    alert("Failed to delete product");
    return;
  }

  alert("Product deleted successfully");
  location.reload();
}

function editProduct(id) {
  window.location.href = `add-product.html?id=${id}`;
}


const totalProducts = document.getElementById("totalProducts");
const lowStockItems = document.getElementById("lowStockItems");
const inventoryValue = document.getElementById("inventoryValue");
const recentProductsBody = document.getElementById("recentProductsBody");

if (totalProducts && lowStockItems && inventoryValue && recentProductsBody) {
  async function loadDashboard() {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });
    const products = await response.json();

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

    const recentProducts = products.slice(0, 5);

    if (recentProducts.length === 0) {
      recentProductsBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">No products added yet</td>
        </tr>
      `;
      return;
    }

    recentProducts.forEach(function (product) {
      const row = `
        <tr>
          <td>${escapeHtml(product.name)}</td>
          <td>${escapeHtml(product.sku || "-")}</td>
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

  loadDashboard();
}
