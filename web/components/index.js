const money = (value) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

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
}

// Abrir as caixas de formulário
$("#newSaleBtn")?.addEventListener("click", () => openModal("saleModal"));

$("#salesNewBtn")?.addEventListener("click", () => openModal("saleModal"));

$("#topNewSale")?.addEventListener("click", () => openModal("saleModal"));

$("#newProductBtn")?.addEventListener("click", () => openModal("productModal"));

$("#newCustomerBtn")?.addEventListener("click", () =>
  openModal("customerModal"),
);

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

const saleForm = document.getElementById("saleForm");

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

  const response = await fetch("/create-sale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(saleData),
  });
  const result = await response.json();
  return result;
}

saleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createSale();
  closeModal("saleModal");
  location.reload();
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

  let totalSales = 0;
  //total amount of sales
  for (i = 0; i < dataS.length; i++) {
    totalSales += dataS[i].total;
  }
  revenueValue.textContent = money(totalSales);
  salesValue.textContent = dataS.length;
  ticketValue.textContent = money(totalSales / dataS.length);
  for (i = 0; i < 5; i++) {
    const row = document.createElement("tr");
    const sale = dataS[i];
    row.innerHTML = `
      <td>${dataS[i].id}</td>
      <td>${capitalizeFirstLetter(dataS[i].user.name)}</td>
      <td>${new Date(dataS[i].CreatedAt).toLocaleDateString()}</td>
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

dashboardSales();
dashboardProducts();
