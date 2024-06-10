let allSalesData = [];
let filteredSalesData = [];

let salesPerHourChart,
  salesPerMonthChart,
  doughnutChart,
  salesPerDayChart,
  revenuePerMonthChart;

// Menggunakan Fetch API untuk mengambil data dari file JSON terpisah
fetch("json/pizzasales.json")
  .then((response) => response.json())
  .then((salesData) => {
    allSalesData = salesData;
    filteredSalesData = salesData; // Inisialisasi dengan semua data
    checkAllMonths(); // Pastikan semua filter bulan terpilih
    updateTable(filteredSalesData); // Inisialisasi tabel dengan semua data
    updateDetailTable(filteredSalesData); // Inisialisasi tabel detail dengan semua data
    updateTotalQuantity(filteredSalesData); // Inisialisasi jumlah total
    updateTotalPrice(filteredSalesData); // Inisialisasi total pendapatan
    initializeCharts(filteredSalesData); // Inisialisasi grafik dengan semua data
  })
  .catch((error) => console.error("Error fetching the data:", error));

function checkAllMonths() {
  const monthCheckboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
  monthCheckboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

function updateTable(data) {
  const salesPerMonth = {};

  // Nama-nama bulan dalam bahasa Indonesia
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  data.forEach((order) => {
    const date = new Date(order.date);
    const month = date.getMonth();
    const quantity = parseInt(order.quantity);
    const price = parseFloat(order.price);

    if (!salesPerMonth[month]) {
      salesPerMonth[month] = {
        totalSales: 0,
        totalRevenue: 0.0,
      };
    }

    salesPerMonth[month].totalSales += quantity;
    salesPerMonth[month].totalRevenue += price * quantity;
  });

  const tableData = [];
  for (const month in salesPerMonth) {
    const monthData = salesPerMonth[month];
    const averageSales = monthData.totalRevenue / monthData.totalSales;
    tableData.push({
      month: monthNames[parseInt(month)],
      totalRevenue: monthData.totalRevenue.toFixed(2),
      totalSales: monthData.totalSales,
      averageSales: averageSales.toFixed(2),
    });
  }

  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum menambahkan data baru

  tableData.forEach((rowData, index) => {
    const row = document.createElement("tr");

    const cellIndex = document.createElement("td");
    cellIndex.textContent = index + 1;
    row.appendChild(cellIndex);

    const cellMonth = document.createElement("td");
    cellMonth.textContent = rowData.month;
    row.appendChild(cellMonth);

    const cellRevenue = document.createElement("td");
    cellRevenue.textContent = `$${parseFloat(rowData.totalRevenue)
      .toFixed(2)
      .toLocaleString()}`;
    row.appendChild(cellRevenue);

    const cellSales = document.createElement("td");
    cellSales.textContent = rowData.totalSales;
    row.appendChild(cellSales);

    const cellAverage = document.createElement("td");
    cellAverage.textContent = `$${parseFloat(rowData.averageSales)
      .toFixed(2)
      .toLocaleString()}`;
    row.appendChild(cellAverage);

    tableBody.appendChild(row);
  });
}

function updateDetailTable(data) {
  const tableBody = document.querySelector("#table-body");
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum menambahkan data baru

  const limitedData = data.slice(0, 5);

  limitedData.forEach((order, index) => {
    const row = document.createElement("tr");

    const cellIndex = document.createElement("td");
    cellIndex.textContent = index + 1;
    row.appendChild(cellIndex);

    const cellPrice = document.createElement("td");
    cellPrice.textContent = `$${parseFloat(order.price)
      .toFixed(2)
      .toLocaleString()}`;
    row.appendChild(cellPrice);

    const cellSize = document.createElement("td");
    cellSize.textContent = order.size;
    row.appendChild(cellSize);

    const cellQuantity = document.createElement("td");
    cellQuantity.textContent = order.quantity;
    row.appendChild(cellQuantity);

    tableBody.appendChild(row);
  });
}

function updateTotalQuantity(data) {
  const totalQuantity = data.reduce(
    (total, order) => total + parseInt(order.quantity),
    0
  );
  document.getElementById("total-quantity").textContent = totalQuantity;
}

function updateTotalPrice(data) {
  const totalPrice = data.reduce(
    (total, order) =>
      total + parseFloat(order.price) * parseInt(order.quantity),
    0
  );
  document.getElementById("total-price").textContent = totalPrice
    .toFixed(2)
    .toLocaleString();
}


function applyFilters() {
  const pizzaCheckboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
  const monthCheckboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
  const selectedPizzas = [];
  const selectedMonths = [];

  pizzaCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedPizzas.push(checkbox.value);
    }
  });

  monthCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedMonths.push(parseInt(checkbox.value));
    }
  });

  // Jika tidak ada checkbox yang dipilih, set filteredSalesData ke array kosong
  if (selectedPizzas.length === 0 && selectedMonths.length === 0) {
    filteredSalesData = [];
  } else {
    filteredSalesData = allSalesData.filter((order) => {
      const month = new Date(order.date).getMonth() + 1; // January is 0 in JavaScript Date
      const pizzaMatch =
        selectedPizzas.length === 0 ||
        selectedPizzas.includes(order.pizza_type_id);
      const monthMatch =
        selectedMonths.length === 0 || selectedMonths.includes(month);
      return pizzaMatch && monthMatch;
    });
  }

  updateTable(filteredSalesData);
  updateDetailTable(filteredSalesData);
  updateTotalQuantity(filteredSalesData);
  updateTotalPrice(filteredSalesData);
  updateAllCharts(filteredSalesData);
}


// Attach event listeners to checkboxes
const pizzaCheckboxes = document.querySelectorAll(
  '.dropdown-menu input[type="checkbox"]'
);
pizzaCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyFilters);
});

const monthCheckboxes = document.querySelectorAll(
  '.dropdown-content input[type="checkbox"]'
);
monthCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyFilters);
});

// Attach the filter function to the input
document
  .getElementById("searchInput")
  .addEventListener("keyup", filterFunction);

// Attach toggleDropdown function to the button
const dropdownButton = document.getElementById("filter-pizza");
dropdownButton.addEventListener("click", function (event) {
  event.stopPropagation(); // Prevent the dropdown from closing when clicked
});

// Initialize charts
function initializeCharts(data) {
  salesPerHourChart = createSalesPerHourChart(data);
  salesPerMonthChart = createSalesPerMonthChart(data);
  doughnutChart = createDoughnutChart(data);
  salesPerDayChart = createSalesPerDayChart(data);
  revenuePerMonthChart = createRevenuePerMonthChart(data);
}

function updateAllCharts(data) {
  updateSalesPerHourChart(data, salesPerHourChart);
  updateSalesPerMonthChart(data, salesPerMonthChart);
  updateDoughnutChart(data, doughnutChart);
  updateSalesPerDayChart(data, salesPerDayChart);
  updateRevenuePerMonthChart(data, revenuePerMonthChart);
}

function createSalesPerHourChart(salesData) {
  const salesPerHour = Array(24).fill(0);

  salesData.forEach((order) => {
    const hour = parseInt(order.time.split(":")[0]);
    const quantity = parseInt(order.quantity);
    salesPerHour[hour] += quantity; // Menambahkan jumlah pesanan ke jam terkait
  });

  // Mengumpulkan data jam dan penjualan, dan menghapus jam dengan penjualan 0
  const filteredSales = [];
  for (let i = 0; i < 24; i++) {
    // Memeriksa semua jam dalam sehari
    if (salesPerHour[i] > 0) {
      filteredSales.push({ hour: i, sales: salesPerHour[i] });
    }
  }

  // Mengurutkan data berdasarkan jumlah penjualan terbesar ke terkecil
  filteredSales.sort((a, b) => b.sales - a.sales);

  // Memisahkan kembali jam dan penjualan untuk digunakan dalam chart
  const hours = filteredSales.map((item) => item.hour);
  const sales = filteredSales.map((item) => item.sales);

  // Membuat barchart menggunakan Chart.js
  const ctx = document.getElementById("barchart").getContext("2d");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: hours,
      datasets: [
        {
          label: "PIZZA",
          data: sales,
          backgroundColor: "rgb(0, 114, 240)",
          borderColor: "rgb(0, 114, 240)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            stepSize: 50,
            beginAtZero: true,
          },
        },
      },
    },
  });
}

function processSalesData(data) {
  const salesData = {};

  data.forEach((order) => {
    const pizzaName = order.pizza_name;
    if (!salesData[pizzaName]) {
      salesData[pizzaName] = Array(12).fill(0);
    }
    const month = new Date(order.date).getMonth();
    salesData[pizzaName][month] += parseInt(order.quantity);
  });

  return salesData;
}

function createSalesPerMonthChart(data) {
  const salesData = processSalesData(data);
  const ctx = document.getElementById("myChart").getContext("2d");
  const datasets = Object.keys(salesData).map((pizzaType) => {
    return {
      label: pizzaType,
      data: salesData[pizzaType],
      fill: false,
      tension: 0.1,
    };
  });

  // Mengurutkan dataset dari terbesar ke terkecil berdasarkan total penjualan
  datasets.sort((a, b) => {
    const totalSalesA = a.data.reduce((acc, val) => acc + val, 0);
    const totalSalesB = b.data.reduce((acc, val) => acc + val, 0);
    return totalSalesB - totalSalesA;
  });

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

function createDoughnutChart(data) {
  const salesData = {};

  data.forEach((order) => {
    const pizzaName = order.pizza_name;
    if (!salesData[pizzaName]) {
      salesData[pizzaName] = 0;
    }
    salesData[pizzaName] += parseInt(order.quantity);
  });

  const ctx1 = document.getElementById("myChart1").getContext("2d");
  const pizzaNames = Object.keys(salesData);
  // Mengurutkan data berdasarkan jumlah penjualan dari terbesar ke terkecil
  pizzaNames.sort((a, b) => salesData[b] - salesData[a]);
  const quantities = pizzaNames.map((pizzaName) => salesData[pizzaName]);

  return new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: pizzaNames,
      datasets: [
        {
          label: "Total Penjualan",
          data: quantities,
          borderWidth: 1,
        },
      ],
    },
    options: {
      aspectRatio: 2.5, // Mengatur rasio aspek menjadi lebih kecil
      plugins: {
        legend: {
          position: "right", // Mengatur posisi label menjadi di samping kanan
          labels: {
            // Mengatur boxWidth agar label berbentuk bulat
            boxWidth: 20,
          },
        },
      },
    },
  });
}

function createSalesPerDayChart(data) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let salesData = new Array(7).fill(0);

  const ctx = document.getElementById("myChart3").getContext("2d");

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: daysOfWeek,
      datasets: [
        {
          label: "QUANTITY",
          data: salesData,
          backgroundColor: "rgb(0, 114, 240)",
          borderWidth: 0,
          barThickness: 49,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          align: "start",
          position: "top",
          labels: {
            padding: 20,
            color: "black",
            font: {
              family: "Roboto", // Set the font family for legend labels
              style: "bold",
            },
            boxWidth: 20,
            boxHeight: 10,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: true,
            color: "black",
            font: {
              family: "Roboto",
              size: 12,
            },
          },
          border: {
            display: true,
            color: "black",
            width: 1,
          },
          barPercentage: 1,
          categoryPercentage: 1,
        },
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 50,
            callback: function (value) {
              if (value === 0 || value === 50 || value === 100) {
                return value;
              }
              return "";
            },
            color: "black",
            font: {
              family: "Roboto",
              size: 12,
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: true,
            color: "white",
            width: 0,
          },
        },
      },
    },
  });

  updateSalesPerDayChart(data, myChart);
  return myChart;
}

function createRevenuePerMonthChart(data) {
  let incomeData = new Array(12).fill(0);

  const ctl = document.getElementById("LineChart").getContext("2d");
  const lineChart = new Chart(ctl, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "REVENUE/MONTH",
          data: incomeData,
          borderWidth: 4,
          backgroundColor: "rgb(0, 114, 240)",
          borderColor: "rgb(0, 114, 240)",
          fill: false,
          tension: 0,
          borderDash: [],
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: "black",
            font: {
              family: "Roboto",
              size: 13,
            },
          },
        },
        y: {
          min: 400,
          max: 800,
          beginAtZero: false,
          ticks: {
            stepSize: 100,
            callback: function (value) {
              return value.toFixed(2).replace(".", ",");
            },
            color: "black",
            font: {
              family: "Roboto",
              size: 13,
            },
          },
          grid: {
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
          },
          border: {
            display: true,
            color: "black",
            width: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "start",
          labels: {
            padding: 0,
            color: "black",
            font: {
              family: "Roboto",
              size: 12,
            },
            boxWidth: 20,
            boxHeight: 1,
          },
        },
      },
      interaction: {
        mode: "nearest", // Mengatur mode interaksi
        axis: "x", // Mengatur interaksi pada sumbu x
        intersect: false, // Menentukan apakah tooltip muncul hanya saat kursor berada tepat di atas titik
      },
      hover: {
        animationDuration: 1,
      },
    },
  });

  updateRevenuePerMonthChart(data, lineChart);
  return lineChart;
}

function updateSalesPerHourChart(data, chart) {
  const salesPerHour = Array(24).fill(0);

  data.forEach((order) => {
    const hour = parseInt(order.time.split(":")[0]);
    const quantity = parseInt(order.quantity);
    salesPerHour[hour] += quantity; // Menambahkan jumlah pesanan ke jam terkait
  });

  // Mengumpulkan data jam dan penjualan, dan menghapus jam dengan penjualan 0
  const filteredSales = [];
  for (let i = 0; i < 24; i++) {
    // Memeriksa semua jam dalam sehari
    if (salesPerHour[i] > 0) {
      filteredSales.push({ hour: i, sales: salesPerHour[i] });
    }
  }

  // Mengurutkan data berdasarkan jumlah penjualan terbesar ke terkecil
  filteredSales.sort((a, b) => b.sales - a.sales);

  // Memisahkan kembali jam dan penjualan untuk digunakan dalam chart
  const hours = filteredSales.map((item) => item.hour);
  const sales = filteredSales.map((item) => item.sales);

  chart.data.labels = hours;
  chart.data.datasets[0].data = sales;
  chart.update();
}

function updateSalesPerMonthChart(data, chart) {
  const salesData = processSalesData(data);
  const datasets = Object.keys(salesData).map((pizzaType) => {
    return {
      label: pizzaType,
      data: salesData[pizzaType],
      fill: false,
      tension: 0.1,
    };
  });

  // Mengurutkan dataset dari terbesar ke terkecil berdasarkan total penjualan
  datasets.sort((a, b) => {
    const totalSalesA = a.data.reduce((acc, val) => acc + val, 0);
    const totalSalesB = b.data.reduce((acc, val) => acc + val, 0);
    return totalSalesB - totalSalesA;
  });

  chart.data.datasets = datasets;
  chart.update();
}

function updateDoughnutChart(data, chart) {
  const salesData = {};

  data.forEach((order) => {
    const pizzaName = order.pizza_name;
    if (!salesData[pizzaName]) {
      salesData[pizzaName] = 0;
    }
    salesData[pizzaName] += parseInt(order.quantity);
  });

  const pizzaNames = Object.keys(salesData);
  // Mengurutkan data berdasarkan jumlah penjualan dari terbesar ke terkecil
  pizzaNames.sort((a, b) => salesData[b] - salesData[a]);
  const quantities = pizzaNames.map((pizzaName) => salesData[pizzaName]);

  chart.data.labels = pizzaNames;
  chart.data.datasets[0].data = quantities;
  chart.update();
}

function updateSalesPerDayChart(data, chart) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let salesData = new Array(7).fill(0);

  const monthCheckboxes = document.querySelectorAll(
    '.dropdown-content input[type="checkbox"]'
  );
  const checkedMonths = Array.from(monthCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => parseInt(checkbox.value));
  salesData = new Array(7).fill(0);

  data.forEach((item) => {
    const date = new Date(item.date);
    const dayOfWeek = date.getDay();
    const month = date.getMonth() + 1;

    if (checkedMonths.includes(month)) {
      salesData[dayOfWeek] += parseInt(item.quantity);
    }
  });

  chart.data.datasets[0].data = salesData;
  chart.update();
}

function updateRevenuePerMonthChart(data, chart) {
  let incomeData = new Array(12).fill(0);

  const monthCheckboxes = document.querySelectorAll(
    '.dropdown-content input[type="checkbox"]'
  );
  const checkedMonths = Array.from(monthCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => parseInt(checkbox.value));
  incomeData = new Array(12).fill(0);

  data.forEach((item) => {
    const date = new Date(item.date);
    const month = date.getMonth(); // 0 (January) to 11 (December)

    if (checkedMonths.includes(month + 1)) {
      incomeData[month] += parseFloat(item.price);
    }
  });

  chart.data.datasets[0].data = incomeData;
  chart.update();
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const div = document.getElementById("myDropdown");
  const labels = div.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    const txtValue = labels[i].textContent || labels[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      labels[i].style.display = ""; // Tampilkan label jika cocok dengan pencarian
      labels[i].previousElementSibling.style.display = ""; // Tampilkan checkbox sebelum label
    } else {
      labels[i].style.display = "none"; // Sembunyikan label jika tidak cocok dengan pencarian
      labels[i].previousElementSibling.style.display = "none"; // Sembunyikan checkbox sebelum label
    }
  }
}

function checkAll() {
  const checkboxes = document.querySelectorAll(
    '.dropdown-content input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => (checkbox.checked = true));
  applyFilters(); // Update the charts after selecting all checkboxes
}

function uncheckAll() {
  const checkboxes = document.querySelectorAll(
    '.dropdown-content input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => (checkbox.checked = false));
  applyFilters(); // Update the charts after unselecting all checkboxes
}

function toggleDropdown() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.classList.toggle("show");
}

document.addEventListener("click", function(event) {
  const dropdown = document.getElementById("dropdown-menu");
  const button = document.getElementById("filter-pizza");
  if (!dropdown.contains(event.target) && !button.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

// Check all month checkboxes when the page loads
document.addEventListener("DOMContentLoaded", function () {
  checkAllMonths();
});

