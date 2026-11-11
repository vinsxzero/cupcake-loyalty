const money = (value) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

async function myInfo() {
  const response = await fetch("/my-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    alert(`Erro ao buscar informações do usuário: ${errorData.message}`);
  }
  const data = await response.json();
  $("#userName").textContent = capitalizeFirstLetter(data.name);
  $("#userRole").textContent = capitalizeFirstLetter(data.role);
  $("#currentDate").textContent = today();
}
myInfo();
async function blockAccess() {}
const today = () => new Date().toLocaleDateString("pt-BR");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
//modais

// Abrir e fechar os modais
function openModal(id) {
  $("#" + id).classList.add("open");
}

function closeModal(id) {
  $("#" + id).classList.remove("open");
  saleForm.reset();

  saleTotal.textContent = "R$ 0,00";
}

// Abrir as caixas de formulário
$("#newSaleBtn")?.addEventListener("click", () => openModal("saleModal"));

$("#salesNewBtn")?.addEventListener("click", () => {
  saleTotal.textContent = "R$ 0,00";
  saleForm.dataset.saleId = "";
  openModal("saleModal");
});

$("#topNewSale")?.addEventListener("click", () => {
  saleTotal.textContent = "R$ 0,00";
  saleForm.dataset.saleId = "";
  openModal("saleModal");
});

$("#newProductBtn")?.addEventListener("click", () => {
  productForm.dataset.productId = "";
  productForm.reset();
  openModal("productModal");
});

$("#newCustomerBtn")?.addEventListener("click", () => {
  customerForm.dataset.customerId = "";
  customerForm.reset();
  openModal("customerModal");
});

// Fechar pelo botão de fechamento
$$("[data-close]").forEach((button) =>
  button.addEventListener("click", () => closeModal(button.dataset.close)),
);

// Fechar ao clicar fora da caixa
$$(".modal-overlay").forEach((overlay) =>
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal(overlay.id);
    }
  }),
);

// Fechar pressionando Esc
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    $$(".modal-overlay.open").forEach((modal) => closeModal(modal.id));
  }
});
// Navegação entre as abas
function navigate(page) {
  $$(".section-page").forEach((section) => section.classList.remove("visible"));

  $("#page-" + page)?.classList.add("visible");

  $$(".nav-item[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const labels = {
    dashboard: "Dashboard",
    sales: "Vendas",
    products: "Produtos e estoque",
    customers: "Clientes",
    reports: "Relatórios",
    settings: "Configurações",
  };

  $("#breadcrumb").textContent = labels[page] || "Dashboard";

  $("#sidebar").classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Eventos de navegação
$$(".nav-item[data-page]").forEach((button) =>
  button.addEventListener("click", () => navigate(button.dataset.page)),
);

$$("[data-goto]").forEach((button) =>
  button.addEventListener("click", () => navigate(button.dataset.goto)),
);

// Abrir e fechar o menu lateral em telas menores
$("#menuBtn")?.addEventListener("click", () =>
  $("#sidebar")?.classList.toggle("open"),
);

// Carregar os ícones Lucide
if (window.lucide) {
  lucide.createIcons();
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

//funtions with api
const revenueValue = document.getElementById("revenueValue");
const salesValue = document.getElementById("salesValue");
const ticketValue = document.getElementById("ticketValue");
const productsValue = document.getElementById("productsValue");
const tableSales = document.getElementById("tableSales");
const allSalesBody = document.getElementById("allSalesBody");
const productsBody = document.getElementById("productsBody");
const saleForm = document.getElementById("saleForm");
const productForm = document.getElementById("productForm");
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  confirm("Tem certeza que deseja sair?") && (await logout());
});

async function logout() {
  const response = await fetch("/logout", {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) {
    window.location.reload();
  } else {
    const error = await response.json();
    alert(`Erro ao sair: ${error.message}`);
  }
}

const customerSelect = document.getElementById("saleCustomerSelect");
async function searchUser() {
  const users = await fetch("/get-users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const dataU = await users.json();
  dataU.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = capitalizeFirstLetter(user.name);
    customerSelect.appendChild(option);
  });
}
const saleProduct = document.getElementById("saleProduct");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");

async function createProduct() {
  const name = productName.value;
  const category = productCategory.value;
  const price = parseFloat(productPrice.value);
  const stock = parseInt(productQuantity.value);
  const productData = {
    name,
    category,
    price,
    stock,
  };
  if (
    productForm.dataset.productId == undefined ||
    productForm.dataset.productId === ""
  ) {
    await fetch("/create-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(productData),
    });
    alert(`Produto criado com sucesso!`);
    window.location.reload();
  } else {
    await fetch(`/update-product/${productForm.dataset.productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(productData),
    });
    alert(`Produto atualizado com sucesso!`);
    window.location.reload();
  }

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    const errorData = await response.json();
    alert(`Erro ao criar produto: ${errorData.message}`);
  }
}
productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createProduct();
  closeModal("productModal");
});
async function searchProduct() {
  const products = await fetch("/get-products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const dataP = await products.json();
  dataP.forEach((product) => {
    const option = document.createElement("option");
    option.dataset.id = product.id;
    option.value = product.price;
    option.textContent = capitalizeFirstLetter(product.name);
    saleProduct.appendChild(option);
  });
}
searchUser();
searchProduct();

const saleQuantity = document.getElementById("saleQuantity");
async function getTotalValue() {
  const saleTotal = document.getElementById("saleTotal");
  if (saleProduct.value === "" || saleQuantity.value === "") {
    saleTotal.textContent = "R$ 0,00";
    return;
  }
  saleTotal.textContent =
    "R$ " + saleProduct.value * parseInt(saleQuantity.value);
}
saleQuantity.addEventListener("input", getTotalValue);
saleProduct.addEventListener("change", getTotalValue);
const saleStatus = document.getElementById("saleStatus");
const salePayment = document.getElementById("salePayment");

async function createSale() {
  const clientId = customerSelect.value;
  const selectedProduct = saleProduct.options[saleProduct.selectedIndex];

  const paymentMethod = salePayment.value;
  const quantity = parseInt(saleQuantity.value);

  const status = saleStatus.value;
  const saleTotal = parseFloat(
    document
      .getElementById("saleTotal")
      .textContent.replace("R$", "")
      .replace(",", "."),
  );
  const saleData = {
    userId: clientId,
    productId: selectedProduct.dataset.id,
    paymentMethod: paymentMethod,
    quantity: quantity,
    paymentMethod: paymentMethod,
    total: saleTotal,
    status: status,
  };
  const saleId = saleForm.dataset.saleId;
  if (saleId === "" || saleId === undefined) {
    const response = await fetch("/create-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(saleData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(`Erro ao criar venda: ${errorData.message}`);
      return;
    }
    const result = await response.json();
    return result;
  } else {
    const response = await fetch(`/update-sale/${saleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(saleData),
    });
    return response.json();
  }
}

saleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createSale();
  closeModal("saleModal");
  window.location.reload();
});
async function dashboardSales() {
  const sales = await fetch("/get-sales", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const dataS = await sales.json();
  return dataS;
}
async function deleteSale(saleId) {
  const confirmDelete = confirm(
    "Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.",
  );
  if (!confirmDelete) {
    return;
  }
  const response = await fetch(`/delete-sale/${saleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    alert(`Erro ao excluir venda: ${errorData.message}`);
    return;
  }
  const result = await response.json();
  alert(`Venda excluída com sucesso!`);
  window.location.reload();
  return result;
}
async function deleteUser(userId) {
  const confirmDelete = confirm(
    "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.",
  );
  if (!confirmDelete) {
    return;
  }
  const response = await fetch(`/delete-user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    alert(`Erro ao excluir usuário: ${errorData.message}`);
    return;
  }
  const result = await response.json();
  alert(`Usuário excluído com sucesso!`);
  window.location.reload();
  return result;
}
async function deleteProduct(productId) {
  const confirmDelete = confirm(
    "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.",
  );
  if (!confirmDelete) {
    return;
  }
  const response = await fetch(`/delete-product/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    alert(`Erro ao excluir produto: ${errorData.message}`);
    return;
  }
  const result = await response.json();
  alert(`Produto excluído com sucesso!`);
  window.location.reload();
  return result;
}
async function displayAllSales() {
  const dataS = await dashboardSales();

  for (i = 0; i < dataS.length; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${dataS[i].id}</td>
      <td>${capitalizeFirstLetter(dataS[i].user.name)}</td>
      <td>${new Date(dataS[i].createdAt).toLocaleDateString()}</td>
      <td>${dataS[i].paymentMethod}</td>
      <td>${money(dataS[i].total)}</td>
      <td>${dataS[i].status}</td>
      <td>
        <button class="icon-button delete-btn" onclick="deleteSale('${dataS[i].id}')">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trash"
              aria-hidden="true"
            >
              <path d="M3 6h18"></path>
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path>
              <path d="M19 6l-1 14H6L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
            </svg>
        </button>
        
        </td>
        <td>
        <button class="icon-button edit-sale-btn" onclick="infoSale('${dataS[i].id}')" >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" 
          height="24" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" 
          stroke-linecap="round" stroke-linejoin="round" 
          class="lucide lucide-pen-line preview-icon">
          <path d="M13 21h8"/>
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 
          16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 
          .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
          </svg>
        </td>
          `;
    allSalesBody.appendChild(row);
  }
}
const editSalesBtns = document.querySelectorAll(".edit-sale-btn");

async function infoSale(saleId) {
  saleForm.dataset.saleId = saleId;
  const response = await fetch(`/get-sale/${saleId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  openModal("saleModal");
  const sale = await response.json();
  console.log("Sale data:", sale);
  customerSelect.value = sale.user.id;

  let saleProductSelected = document.querySelector(
    `#saleProduct option[data-id="${sale.product.id}"]`,
  );
  if (saleProductSelected) {
    saleProductSelected.selected = true;
  }
  salePayment.value = sale.paymentMethod;
  salePayment.value = sale.paymentMethod;
  saleQuantity.value = sale.quantity;
  saleStatus.value = sale.status;
  document.getElementById("saleTotal").textContent = money(sale.total);
}
async function displayDashboardSales() {
  const dataS = await dashboardSales();
  let totalSales = 0;
  let totalSalesCount = 0;
  //total amount of sales
  for (i = 0; i < dataS.length; i++) {
    if (dataS[i].status !== "CANCELADA") {
      totalSales += parseFloat(dataS[i].total);
      totalSalesCount++;
    }
  }
  revenueValue.textContent = money(totalSales);
  salesValue.textContent = dataS.length;
  ticketValue.textContent = money(totalSales / totalSalesCount);
  for (i = 0; i < 5; i++) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${dataS[i].id}</td>
      <td>${capitalizeFirstLetter(dataS[i].user.name)}</td>
      <td>${new Date(dataS[i].createdAt).toLocaleDateString()}</td>
      <td>${dataS[i].paymentMethod}</td>
      <td>${money(dataS[i].total)}</td>
      <td>${dataS[i].status}</td>
    `;
    tableSales.appendChild(row);
  }
}
async function dashboardProducts() {
  const products = await fetch("/get-products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const dataP = await products.json();
  return dataP;
}
const inventoryProductCount = document.getElementById("inventoryProductCount");
const inventoryLow = document.getElementById("inventoryLow");
const inventoryUnits = document.getElementById("inventoryUnits");
const inventoryValue = document.getElementById("inventoryValue");
const lowStockCount = document.getElementById("lowStockCount");
async function displayAllProducts() {
  const dataP = await dashboardProducts();
  let lowStock = 0;
  let allStock = 0;
  let invValue = 0;
  for (i = 0; i < dataP.length; i++) {
    let stockStatus = "";
    allStock += dataP[i].stock;
    if (dataP[i].stock > 15) {
      stockStatus = "Em estoque";
    } else if (dataP[i].stock <= 15) {
      stockStatus = "Estoque baixo";
      lowStock++;
    } else {
      stockStatus = "Fora de estoque";
      lowStock++;
    }

    invValue += dataP[i].stock * dataP[i].price;

    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${capitalizeFirstLetter(dataP[i].name)}</td>
    <td>${dataP[i].stock}</td>
    <td>${money(dataP[i].price)}</td>
    <td>${stockStatus}</td>
    <td>
      <button class="icon-button delete-btn" onclick="deleteProduct('${dataP[i].id}')">
        <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-trash"
  aria-hidden="true"
>
  <path d="M3 6h18"></path>
  <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path>
  <path d="M19 6l-1 14H6L5 6"></path>
  <path d="M10 11v6"></path>
  <path d="M14 11v6"></path>
</svg>
      </button>
    </td>
    <td>
      <button class="icon-button edit-sale-btn" onclick="infoProduct('${dataP[i].id}')" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" 
        height="24" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" 
        stroke-linecap="round" stroke-linejoin="round" 
        class="lucide lucide-pen-line preview-icon">
        <path d="M13 21h8"/>
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 
        16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 
        .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
        </svg>
      </button>
    </td>
    `;
    productsBody.appendChild(row);
  }
  inventoryProductCount.textContent = dataP.length;

  inventoryLow.textContent = lowStock;
  inventoryUnits.textContent = allStock;
  inventoryValue.textContent = money(invValue);
  if (lowStock == 0) {
    lowStockCount.style.display = "none";
  } else {
    lowStockCount.textContent = lowStock;
  }
}
async function infoProduct(productId) {
  const product = await fetch(`/get-product/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const dataP = await product.json();
  openModal("productModal");
  productForm.dataset.productId = productId;
  productName.value = dataP.name;
  productCategory.value = dataP.category;
  productPrice.value = dataP.price;
  productQuantity.value = dataP.stock;
  console.log("Product data:", dataP);
}
async function displayDashboardProducts() {
  const dataP = await dashboardProducts();
  productsValue.textContent = dataP.length;
  const featuredProducts = document.getElementById("featuredProducts");
  for (i = 0; i < 2; i++) {
    const product = dataP[i];
    const productElement = document.createElement("div");
    productElement.classList.add("product-row");
    productElement.innerHTML = `
    <div class="product-thumb">🚀</div>
    <div class="product-info">
      <div class="product-name">${capitalizeFirstLetter(product.name)}</div>
      <div class="product-meta">${product.stock} unidades em estoque</div>
    </div>
      <div class="product-amount">${money(product.price)}</div>
    
    `;
    featuredProducts.appendChild(productElement);
  }
}
const tableCustomers = document.getElementById("customersBody");
async function dashboardCustomers() {
  const customers = await fetch("/get-users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const dataC = await customers.json();
  console.log("Customer role:", dataC);
  for (i = 0; i < dataC.length; i++) {
    const row = document.createElement("tr");
    if (dataC[i].role === "client") {
      row.innerHTML = `
      <td>${capitalizeFirstLetter(dataC[i].name)}</td>
      <td>${dataC[i].email}</td>
      <td>${dataC[i].role.toUpperCase()}</td>
      <td>
        <button class="icon-button delete-btn" onclick="deleteUser('${dataC[i].id}')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash"
            aria-hidden="true"
          >
            <path d="M3 6h18"></path>
            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
          </svg>
        </button>
      </td>
      
      
    </td>
    `;
      tableCustomers.appendChild(row);
    } else {
      row.innerHTML = `
      <td>${capitalizeFirstLetter(dataC[i].name)}</td>
      <td>${dataC[i].email}</td>
      <td>${dataC[i].role.toUpperCase()}</td>
      <td>
        <button class="icon-button delete-btn disabled" disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash"
            aria-hidden="true"
          >
            <path d="M3 6h18"></path>
            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
          </svg>
        </button>
      </td>
    `;
      tableCustomers.appendChild(row);
    }
  }
}

const customerForm = document.getElementById("customerForm");
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const roleCustumer = document.getElementById("roleCustumer");
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
async function createCustomer() {
  const name = customerName.value;
  const email = customerEmail.value;
  const role = roleCustumer.value;
  const password = generateRandomPassword(8);
  const customerData = {
    name: name,
    email: email,
    role: role,
    password: password,
  };
  if (
    !customerForm.dataset.customerId ||
    customerForm.dataset.customerId === ""
  ) {
    const response = await fetch("/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(customerData),
    });
    if (response.ok) {
      const result = await response.json();
      alert(`Cliente criado com sucesso! Senha: ${password}`);
      return result;
    }
    console.log(response);
    alert("Erro ao criar cliente. Verifique se o e-mail já está em uso.");
  } else {
  }
}
customerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await createCustomer();
  closeModal("customerModal");
  location.reload();
});
$("#btnCustomer").addEventListener("click", () => {
  tableCustomers.innerHTML = "";
  dashboardCustomers();
});
displayAllSales();
displayAllProducts();
displayDashboardSales();
displayDashboardProducts();
