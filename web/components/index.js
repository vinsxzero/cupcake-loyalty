const money = (value) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const today = () => new Date().toLocaleDateString("pt-BR");

// Dados fictícios para demonstração. Não representam vendas reais.
const products = [
  {
    id: 1,
    name: "Cupcake de chocolate",
    category: "Cupcake",
    price: 8,
    stock: 42,
    emoji: "🧁",
  },
  {
    id: 2,
    name: "Cupcake de morango",
    category: "Cupcake",
    price: 9,
    stock: 28,
    emoji: "🍓",
  },
  {
    id: 3,
    name: "Cupcake de baunilha",
    category: "Cupcake",
    price: 7.5,
    stock: 36,
    emoji: "🧁",
  },
  {
    id: 4,
    name: "Brownie tradicional",
    category: "Brownie",
    price: 9,
    stock: 5,
    emoji: "🍫",
  },
  {
    id: 5,
    name: "Brownie recheado",
    category: "Brownie",
    price: 12,
    stock: 18,
    emoji: "🍫",
  },
  {
    id: 6,
    name: "Mini bolo de cenoura",
    category: "Bolo",
    price: 15,
    stock: 4,
    emoji: "🍰",
  },
  {
    id: 7,
    name: "Brigadeiro gourmet",
    category: "Doce",
    price: 3.5,
    stock: 55,
    emoji: "🍬",
  },
  {
    id: 8,
    name: "Caixa presenteável",
    category: "Outro",
    price: 5,
    stock: 60,
    emoji: "🎁",
  },
];

const sales = [
  {
    id: 1001,
    customer: "Mariana Costa",
    date: today(),
    payment: "Pix",
    total: 48,
    status: "Concluída",
  },
  {
    id: 1002,
    customer: "Lucas Almeida",
    date: today(),
    payment: "Cartão de crédito",
    total: 72,
    status: "Concluída",
  },
  {
    id: 1003,
    customer: "Beatriz Santos",
    date: today(),
    payment: "Dinheiro",
    total: 35,
    status: "Pendente",
  },
  {
    id: 1004,
    customer: "Fernanda Lima",
    date: today(),
    payment: "Pix",
    total: 54.5,
    status: "Concluída",
  },
  {
    id: 1005,
    customer: "Rafael Souza",
    date: today(),
    payment: "Cartão de débito",
    total: 28,
    status: "Concluída",
  },
];

const customers = [
  {
    name: "Mariana Costa",
    phone: "(11) 98888-1234",
    email: "mariana@exemplo.com",
    date: today(),
  },
  {
    name: "Lucas Almeida",
    phone: "(11) 97777-5678",
    email: "lucas@exemplo.com",
    date: today(),
  },
  {
    name: "Beatriz Santos",
    phone: "(11) 96666-9012",
    email: "beatriz@exemplo.com",
    date: today(),
  },
  {
    name: "Fernanda Lima",
    phone: "(11) 95555-3456",
    email: "fernanda@exemplo.com",
    date: today(),
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 3000);
}

function openModal(id) {
  $("#" + id).classList.add("open");
}

function closeModal(id) {
  $("#" + id).classList.remove("open");
}

function statusHTML(status) {
  const classes = {
    Concluída: "status-complete",
    Pendente: "status-pending",
    Cancelada: "status-cancelled",
  };
  return `<span class="status ${classes[status] || ""}">${escapeHTML(status)}</span>`;
}

function salesRows(list) {
  if (!list.length) {
    return `<tr><td class="empty-row" colspan="6">Nenhuma venda encontrada.</td></tr>`;
  }

  return list
    .map(
      (sale) => `
      <tr>
        <td class="sale-id">#VD-${sale.id}</td>
        <td class="customer-cell">${escapeHTML(sale.customer)}</td>
        <td>${escapeHTML(sale.date)}</td>
        <td>${escapeHTML(sale.payment)}</td>
        <td style="font-weight:700;color:var(--text)">${money(sale.total)}</td>
        <td>${statusHTML(sale.status)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderSales() {
  const sorted = [...sales].reverse();
  $("#recentSalesBody").innerHTML = salesRows(sorted.slice(0, 5));
  $("#allSalesBody").innerHTML = salesRows(filterSales());
  $("#recentSalesCount").textContent = `${sales.length} vendas registradas`;
  $("#allSalesCount").textContent = `${filterSales().length} resultado(s)`;
}

function filterSales() {
  const query = ($("#salesSearch")?.value || "").toLowerCase().trim();
  const status = $("#salesStatusFilter")?.value || "";

  return [...sales]
    .reverse()
    .filter(
      (sale) =>
        `${sale.id} ${sale.customer}`.toLowerCase().includes(query) &&
        (!status || sale.status === status),
    );
}

function renderProducts() {
  const query = ($("#productSearch")?.value || "").toLowerCase().trim();
  const filtered = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query),
  );

  $("#productsBody").innerHTML = filtered.length
    ? filtered
        .map((product) => {
          const low = product.stock <= 5;
          return `<tr>
            <td class="customer-cell">${product.emoji} ${escapeHTML(product.name)}</td>
            <td>${escapeHTML(product.category)}</td>
            <td>${money(product.price)}</td>
            <td>${product.stock} un.</td>
            <td>${
              low
                ? '<span class="status status-pending">Estoque baixo</span>'
                : '<span class="status status-complete">Disponível</span>'
            }
            </td>
          </tr>`;
        })
        .join("")
    : '<tr><td class="empty-row" colspan="5">Nenhum produto encontrado.</td></tr>';

  const lowCount = products.filter((p) => p.stock <= 5).length;
  $("#lowStockCount").textContent = lowCount;
  $("#inventoryProductCount").textContent = products.length;
  $("#productsValue").textContent = products.length;
  $("#inventoryUnits").textContent = products.reduce(
    (sum, p) => sum + p.stock,
    0,
  );
  $("#inventoryLow").textContent = lowCount;
  $("#inventoryValue").textContent = money(
    products.reduce((sum, p) => sum + p.stock * p.price, 0),
  );

  $("#saleProduct").innerHTML = products
    .map(
      (p) =>
        `<option value="${p.id}" ${p.stock < 1 ? "disabled" : ""}>
        ${escapeHTML(p.name)} — ${money(p.price)} (${p.stock} un.)
      </option>`,
    )
    .join("");

  updateSaleTotal();
}

function renderCustomers() {
  const query = ($("#customerSearch")?.value || "").toLowerCase().trim();
  const filtered = customers.filter((c) =>
    `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(query),
  );

  $("#customersBody").innerHTML = filtered.length
    ? filtered
        .map(
          (c) => `<tr>
          <td class="customer-cell">${escapeHTML(c.name)}</td>
          <td>${escapeHTML(c.phone || "—")}</td>
          <td>${escapeHTML(c.email || "—")}</td>
          <td>${escapeHTML(c.date)}</td>
        </tr>`,
        )
        .join("")
    : '<tr><td class="empty-row" colspan="4">Nenhum cliente encontrado.</td></tr>';

  $("#reportCustomers").textContent = customers.length;
}

function renderReports() {
  const completed = sales.filter((s) => s.status === "Concluída");
  const revenue = completed.reduce((sum, s) => sum + s.total, 0);
  const ticket = completed.length ? revenue / completed.length : 0;

  $("#reportRevenue").textContent = money(revenue);
  $("#reportSales").textContent = completed.length;
  $("#reportTicket").textContent = money(ticket);

  $("#reportSummary").innerHTML = `
      <div class="product-row">
        <div class="product-info"><div class="product-name">Faturamento concluído</div></div>
        <div class="product-amount">${money(revenue)}</div>
      </div>
      <div class="product-row">
        <div class="product-info"><div class="product-name">Vendas pendentes</div></div>
        <div class="product-amount">${sales.filter((s) => s.status === "Pendente").length}</div>
      </div>
      <div class="product-row">
        <div class="product-info"><div class="product-name">Vendas canceladas</div></div>
        <div class="product-amount">${sales.filter((s) => s.status === "Cancelada").length}</div>
      </div>
      <div class="product-row">
        <div class="product-info"><div class="product-name">Clientes cadastrados</div></div>
        <div class="product-amount">${customers.length}</div>
      </div>
    `;
}

function renderDashboard() {
  const completed = sales.filter((s) => s.status === "Concluída");
  const revenue = completed.reduce((sum, s) => sum + s.total, 0);

  $("#revenueValue").textContent = money(revenue);
  $("#salesValue").textContent = sales.length;
  $("#ticketValue").textContent = money(
    completed.length ? revenue / completed.length : 0,
  );
}

function renderAll() {
  renderSales();
  renderProducts();
  renderCustomers();
  renderReports();
  renderDashboard();

  if (window.lucide) lucide.createIcons();
}

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

function updateSaleTotal() {
  const product = products.find(
    (p) => p.id === Number($("#saleProduct").value),
  );
  const quantity = Math.max(0, Number($("#saleQuantity").value) || 0);
  $("#saleTotal").textContent = money(product ? product.price * quantity : 0);
}

function refreshCustomerOptions() {
  // O campo aceita nomes novos, sem exigir cadastro prévio do cliente.
}

// Navegação
$$(".nav-item[data-page]").forEach((button) =>
  button.addEventListener("click", () => navigate(button.dataset.page)),
);

$$("[data-goto]").forEach((button) =>
  button.addEventListener("click", () => navigate(button.dataset.goto)),
);

$("#menuBtn").addEventListener("click", () =>
  $("#sidebar").classList.toggle("open"),
);

// Abertura e fechamento dos modais
$("#newSaleBtn").addEventListener("click", () => openModal("saleModal"));
$("#salesNewBtn").addEventListener("click", () => openModal("saleModal"));
$("#topNewSale").addEventListener("click", () => openModal("saleModal"));
$("#newProductBtn").addEventListener("click", () => openModal("productModal"));
$("#newCustomerBtn").addEventListener("click", () =>
  openModal("customerModal"),
);

$$("[data-close]").forEach((button) =>
  button.addEventListener("click", () => closeModal(button.dataset.close)),
);

$$(".modal-overlay").forEach((overlay) =>
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal(overlay.id);
  }),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    $$(".modal-overlay.open").forEach((modal) => closeModal(modal.id));
  }
});

// Pesquisa e filtros
$("#salesSearch").addEventListener("input", renderSales);
$("#salesStatusFilter").addEventListener("change", renderSales);
$("#productSearch").addEventListener("input", renderProducts);
$("#customerSearch").addEventListener("input", renderCustomers);
$("#saleProduct").addEventListener("change", updateSaleTotal);
$("#saleQuantity").addEventListener("input", updateSaleTotal);

// Registro de venda
$("#saleForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const customer = $("#saleCustomer").value.trim();
  const product = products.find(
    (p) => p.id === Number($("#saleProduct").value),
  );
  const quantity = Number($("#saleQuantity").value);
  const status = $("#saleStatus").value;

  if (!customer || !product || !Number.isInteger(quantity) || quantity < 1) {
    toast("Confira os dados da venda.");
    return;
  }

  if (quantity > product.stock) {
    toast("Quantidade superior ao estoque disponível.");
    return;
  }

  const total = product.price * quantity;

  sales.push({
    id: Math.max(1000, ...sales.map((s) => s.id)) + 1,
    customer,
    date: today(),
    payment: $("#salePayment").value,
    total,
    status,
  });

  if (status === "Concluída") product.stock -= quantity;

  if (!customers.some((c) => c.name.toLowerCase() === customer.toLowerCase())) {
    customers.push({
      name: customer,
      phone: "",
      email: "",
      date: today(),
    });
  }

  $("#saleForm").reset();
  $("#saleQuantity").value = 1;
  closeModal("saleModal");
  renderAll();
  toast("Venda registrada com sucesso!");
});

// Cadastro de produto
$("#productForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#productName").value.trim();
  const price = Number($("#productPrice").value);
  const stock = Number($("#productQuantity").value);

  if (
    !name ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    toast("Confira os dados do produto.");
    return;
  }

  products.push({
    id: Math.max(0, ...products.map((p) => p.id)) + 1,
    name,
    category: $("#productCategory").value,
    price,
    stock,
    emoji: "🧁",
  });

  $("#productForm").reset();
  closeModal("productModal");
  renderAll();
  toast("Produto cadastrado com sucesso!");
});

// Cadastro de cliente
$("#customerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#customerName").value.trim();
  const email = $("#customerEmail").value.trim();

  if (!name) {
    toast("Informe o nome do cliente.");
    return;
  }

  if (customers.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    toast("Este cliente já está cadastrado.");
    return;
  }

  customers.push({
    name,
    phone: $("#customerPhone").value.trim(),
    email,
    date: today(),
  });

  $("#customerForm").reset();
  closeModal("customerModal");
  renderAll();
  toast("Cliente cadastrado com sucesso!");
});

// Exportação de relatório em CSV
$("#exportBtn").addEventListener("click", () => {
  const rows = [
    ["Venda", "Cliente", "Data", "Pagamento", "Valor", "Status"],
    ...sales.map((s) => [
      s.id,
      s.customer,
      s.date,
      s.payment,
      s.total.toFixed(2),
      s.status,
    ]),
  ];

  const csv =
    "\uFEFF" +
    rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(";"),
      )
      .join("\r\n");

  const url = URL.createObjectURL(
    new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    }),
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = "relatorio-vendas.csv";
  link.click();
  URL.revokeObjectURL(url);
  toast("Relatório exportado.");
});

// Gráfico demonstrativo
$("#chartPeriod").addEventListener("change", (event) => {
  const previous = event.target.value === "previous";
  const points = previous
    ? [150, 95, 115, 75, 105, 62, 90]
    : [132, 108, 120, 68, 87, 43, 55];

  const coords = points.map((y, i) => `${48 + i * 70} ${y}`).join(" L ");
  $("#chartLine").setAttribute("d", "M " + coords);
  $("#chartArea").setAttribute("d", "M " + coords + " L 468 185 L 48 185 Z");

  $("#chartDots").innerHTML = points
    .map(
      (y, i) =>
        `<circle class="chart-dot" cx="${48 + i * 70}" cy="${y}" r="4"/>`,
    )
    .join("");
});

$("#currentDate").textContent = new Date().toLocaleDateString("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

renderAll();
