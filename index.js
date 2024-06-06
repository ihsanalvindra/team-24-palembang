document.addEventListener('DOMContentLoaded', function() {
    // Menggunakan Fetch API untuk mengambil data dari file JSON terpisah
    fetch('pizzasales.json')
        .then(response => response.json())
        .then(salesData => {
            // Menghitung jumlah penjualan per jam
            const salesPerHour = Array(24).fill(0);

            salesData.forEach(order => {
                const hour = parseInt(order.time.split(':')[0]);
                const quantity = parseInt(order.quantity);
                salesPerHour[hour] += quantity; // Menambahkan jumlah pesanan ke jam terkait
            });

            // Mengumpulkan data jam dan penjualan, dan menghapus jam dengan penjualan 0
            const filteredSales = [];
            for (let i = 0; i < 24; i++) { // Memeriksa semua jam dalam sehari
                if (salesPerHour[i] > 0) {
                    filteredSales.push({ hour: i, sales: salesPerHour[i] });
                }
            }

            // Mengurutkan data berdasarkan jumlah penjualan terbesar ke terkecil
            filteredSales.sort((a, b) => b.sales - a.sales);

            // Memisahkan kembali jam dan penjualan untuk digunakan dalam chart
            const hours = filteredSales.map(item => item.hour);
            const sales = filteredSales.map(item => item.sales);

            // Membuat barchart menggunakan Chart.js
            const ctx = document.getElementById('barchart').getContext('2d');
            const pizzaSalesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'PIZZA',
                        data: sales,
                        backgroundColor: 'rgb(0, 114, 240)',
                        borderColor: 'rgb(0, 114, 240)',
                    }]
                },
                options: {
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                stepSize: 50,
                                beginAtZero: true
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching the data:', error));
});




document.addEventListener('DOMContentLoaded', function() {
    let allSalesData = [];
    let filteredSalesData = [];

    // Menggunakan Fetch API untuk mengambil data dari file JSON terpisah
    fetch('pizzasales.json')
        .then(response => response.json())
        .then(salesData => {
            allSalesData = salesData;
            filteredSalesData = salesData; // Inisialisasi dengan semua data
            updateTable(filteredSalesData); // Inisialisasi tabel dengan semua data
            updateTotalQuantity(filteredSalesData); // Inisialisasi jumlah total
            updateTotalPrice(filteredSalesData); // Inisialisasi total pendapatan
        })
        .catch(error => console.error('Error fetching the data:', error));

    function updateTable(data) {
        const salesPerMonth = {};

        // Nama-nama bulan dalam bahasa Indonesia
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        data.forEach(order => {
            const date = new Date(order.date);
            const month = date.getMonth();
            const quantity = parseInt(order.quantity);
            const price = parseFloat(order.price);

            if (!salesPerMonth[month]) {
                salesPerMonth[month] = {
                    totalSales: 0,
                    totalRevenue: 0.0
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
                averageSales: averageSales.toFixed(2)
            });
        }

        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

        tableData.forEach((rowData, index) => {
            const row = document.createElement('tr');

            const cellIndex = document.createElement('td');
            cellIndex.textContent = index + 1;
            row.appendChild(cellIndex);

            const cellMonth = document.createElement('td');
            cellMonth.textContent = rowData.month;
            row.appendChild(cellMonth);

            const cellRevenue = document.createElement('td');
            cellRevenue.textContent = `$${parseFloat(rowData.totalRevenue).toFixed(2).toLocaleString()}`;
            row.appendChild(cellRevenue);

            const cellSales = document.createElement('td');
            cellSales.textContent = rowData.totalSales;
            row.appendChild(cellSales);

            const cellAverage = document.createElement('td');
            cellAverage.textContent = `$${parseFloat(rowData.averageSales).toFixed(2).toLocaleString()}`;
            row.appendChild(cellAverage);

            tableBody?.appendChild(row);
        });
    }

    function updateTotalQuantity(data) {
        const totalQuantity = data.reduce((total, order) => total + parseInt(order.quantity), 0);
        document.getElementById('total-quantity').textContent = totalQuantity;
    }

    function updateTotalPrice(data) {
        const totalPrice = data.reduce((total, order) => total + (parseFloat(order.price) * parseInt(order.quantity)), 0);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2).toLocaleString();
    }

    // Ambil elemen-elemen yang diperlukan
    const dropdownButton = document.getElementById("filter-pizza");
    const dropdownMenu = document.getElementById("dropdown-menu");

    // Fungsi untuk menampilkan atau menyembunyikan dropdown menu
    function toggleDropdown() {
        dropdownMenu.classList.toggle("show");
    }

    // Fungsi untuk menyembunyikan dropdown menu ketika mengklik di luar
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#filter-pizza') && !event.target.closest('.dropdown-menu')) {
            dropdownMenu.classList.remove('show');
        }
    });

    dropdownMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    function filterFunction() {
        const input = document.getElementById("searchInput");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("dropdown-menu");
        const labels = div.getElementsByTagName("label");

        for (let i = 0; i < labels.length; i++) {
            const txtValue = labels[i].textContent || labels[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                labels[i].style.display = "";
                labels[i].previousElementSibling.style.display = "";
            } else {
                labels[i].style.display = "none";
                labels[i].previousElementSibling.style.display = "none";
            }
        }
    }

    function applyFilters() {
        const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
        const selectedPizzas = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedPizzas.push(checkbox.value);
            }
        });

        if (selectedPizzas.length > 0) {
            filteredSalesData = allSalesData.filter(order => selectedPizzas.includes(order.pizza_type_id));
        } else {
            filteredSalesData = []; // Kosongkan data jika tidak ada yang dipilih
        }

        updateTable(filteredSalesData);
        updateTotalQuantity(filteredSalesData);
        updateTotalPrice(filteredSalesData);
    }

    // Attach event listeners to checkboxes
    const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Attach the filter function to the input
    document.getElementById("searchInput").addEventListener('keyup', filterFunction);

    // Attach toggleDropdown function to the button
    dropdownButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the dropdown from closing when clicked
        toggleDropdown();
    });
});

//  chart line sales/month start
document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk memproses data dan menghitung penjualan per bulan
    function processSalesData(data) {
        const salesData = {};

        data.forEach(order => {
            const pizzaName = order.pizza_name;
            if (!salesData[pizzaName]) {
                salesData[pizzaName] = Array(12).fill(0);
            }
            const month = new Date(order.date).getMonth();
            salesData[pizzaName][month] += parseInt(order.quantity);
        });

        return salesData;
    }

    // Fungsi untuk membuat line chart menggunakan Chart.js
    function createLineChart(salesData) {
        const ctx = document.getElementById('myChart').getContext('2d');
        const datasets = Object.keys(salesData).map(pizzaType => {
            return {
                label: pizzaType,
                data: salesData[pizzaType],
                fill: false,
                tension: 0.1
            };
        });

        // Mengurutkan dataset dari terbesar ke terkecil berdasarkan total penjualan
        datasets.sort((a, b) => {
            const totalSalesA = a.data.reduce((acc, val) => acc + val, 0);
            const totalSalesB = b.data.reduce((acc, val) => acc + val, 0);
            return totalSalesB - totalSalesA;
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    // Menggunakan Fetch API untuk mengambil data dari file JSON
    fetch('pizzasales.json')
        .then(response => response.json())
        .then(data => {
            const salesData = processSalesData(data);
            createLineChart(salesData);
        })
        .catch(error => console.error('Error fetching the data:', error));
});


//chart donat 5 pizza start

document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk memproses data dan menghitung penjualan per bulan
    function processSalesData(data) {
        const salesData = {};

        data.forEach(order => {
            const pizzaName = order.pizza_name;
            if (!salesData[pizzaName]) {
                salesData[pizzaName] = 0;
            }
            salesData[pizzaName] += parseInt(order.quantity);
        });

        return salesData;
    }

    // Fungsi untuk membuat doughnut chart menggunakan Chart.js
    function createDoughnutChart(salesData) {
        const ctx1 = document.getElementById('myChart1').getContext('2d');
        const pizzaNames = Object.keys(salesData);
        // Mengurutkan data berdasarkan jumlah penjualan dari terbesar ke terkecil
        pizzaNames.sort((a, b) => salesData[b] - salesData[a]);
        const quantities = pizzaNames.map(pizzaName => salesData[pizzaName]);

        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: pizzaNames,
                datasets: [{
                    label: 'Total Penjualan',
                    data: quantities,
                    borderWidth: 1
                }]
            },
            options: {
                aspectRatio: 2.5, // Mengatur rasio aspek menjadi lebih kecil
                plugins: {
                    legend: {
                        position: 'right', // Mengatur posisi label menjadi di samping kanan
                        labels: {
                            // Mengatur boxWidth agar label berbentuk bulat
                            boxWidth: 20
                        }
                    }
                }
            }
        });
    }

    // Menggunakan Fetch API untuk mengambil data dari file JSON
    fetch('pizzasales.json')
        .then(response => response.json())
        .then(data => {
            const salesData = processSalesData(data);
            createDoughnutChart(salesData);
        })
        .catch(error => console.error('Error fetching the data:', error));
});



//chart donat end


//json tabel start
async function fetchDataAndFillTable() {
    try {
        // Fetch data from the JSON file
        const response = await fetch('pizzasales.json');
        const data = await response.json();

        // Objek untuk menyimpan total penjualan setiap pizza
        const pizzaSales = {};

        // Loop through the data and calculate total sales for each pizza
        data.forEach(order => {
            const pizzaName = order.pizza_name;
            const quantity = parseInt(order.quantity);
            if (!pizzaSales[pizzaName]) {
                // Jika nama pizza belum ada dalam objek, tambahkan dengan properti size dan price
                pizzaSales[pizzaName] = {
                    totalSales: 0,
                    size: order.size,
                    price: parseFloat(order.price)
                };
            }
            // Tambahkan jumlah penjualan pizza dari pesanan saat ini
            pizzaSales[pizzaName].totalSales += quantity;
        });

        // Urutkan pizzaSales berdasarkan total penjualan dari terbesar ke terkecil
        const sortedPizzaSales = Object.keys(pizzaSales).sort((a, b) => {
            return pizzaSales[b].totalSales - pizzaSales[a].totalSales;
        });

        // Get the table body element
        const tableBody = document.getElementById('table-body');

        // Loop through the sorted pizza sales data and create table rows
        sortedPizzaSales.forEach((pizzaName, index) => {
            const row = document.createElement('tr');
            
            // Create cell for the index
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1; // Add 1 to start index from 1
            row.appendChild(indexCell);

            // Create cell for pizza price
            const priceCell = document.createElement('td');
            priceCell.textContent = pizzaSales[pizzaName].price;
            row.appendChild(priceCell);

            // Create cell for pizza size
            const sizeCell = document.createElement('td');
            sizeCell.textContent = pizzaSales[pizzaName].size;
            row.appendChild(sizeCell);

            // Create cell for total sales
            const totalSalesCell = document.createElement('td');
            totalSalesCell.textContent = pizzaSales[pizzaName].totalSales;
            row.appendChild(totalSalesCell);

            // Append the row to the table body
            tableBody?.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

// Panggil fungsi untuk mengisi tabel
fetchDataAndFillTable();

//cek apakah file json kita terbaca atau tidak
fetch('pizzasales.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching or parsing data:', error));

  document.addEventListener('DOMContentLoaded', function () {
    fetch('pizzasales.json')
    .then(response => response.json())
    .then(data => {
        // Proses data untuk chart bar
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let salesData = []; // Variabel untuk menyimpan data penjualan yang akan ditampilkan di chart
        let incomeData = new Array(7).fill(0);
  
        const barLabelPlugin = {
          id: 'barLabelPlugin',
          afterDatasetsDraw: function(chart) {
            if (chart.config.type !== 'bar') return; // Tambahkan pengecekan jenis chart
            const ctx = chart.ctx;
            chart.data.datasets.forEach(function(dataset, i) {
              const meta = chart.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                const data = dataset.data[index];
                const centerX = bar.x;
                const centerY = bar.y;
                ctx.fillStyle = 'white';
                ctx.font = '12px Roboto';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(data, centerX, centerY - 0);
              });
            });
          }
        };
  
          // Daftarkan plugin ke Chart.js
          Chart.register(barLabelPlugin);
  
        // Inisialisasi chart
        const ctx = document.getElementById('myChart3');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: daysOfWeek,
                datasets: [{
                    label: 'QUANTITY',
                    data: salesData,
                    backgroundColor: 'rgb(0, 114, 240)',
                    borderWidth: 0,
                    barThickness: 49,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        align: 'start',
                        position: 'top',
                        labels: {
                            padding: 20,
                            color: 'black',
                            font: {
                                family: 'Roboto', // Set the font family for legend labels
                                style: 'bold'
                            },
                            boxWidth: 20,
                            boxHeight: 10
                        }
                      }
                    },
              
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            display: true,
                            color: 'black',
                            font: {
                                family: 'Roboto',
                                size: '12',
                            }
                        },
                        border: {
                            display: true,
                            color: 'black',
                            width: 1
                        },
                        barPercentage: 1,
                        categoryPercentage: 1
                    },
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 50,
                            callback: function(value) {
                                if (value === 0 || value === 50 || value === 100) {
                                    return value;
                                }
                                return '';
                            },
                            color: 'black',
                            font: {
                                family: 'Roboto',
                                size: '12',
                            }
                        },
                        grid: {
                            display: false,
                        },
                        border: {
                            display: true,
                            color: 'white',
                            width: 0
                        }
                    }
                }
            }
        });
  
        const ctl = document.getElementById('LineChart');
        const lineChart = new Chart(ctl, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'REVENUE/MONTH',
                    data: incomeData,
                    borderWidth: 4,
                    backgroundColor: 'rgb(0, 114, 240)',
                    borderColor: 'rgb(0, 114, 240)',
                    fill: false,
                    tension: 0,
                    borderDash: [],
                    pointRadius: 0
                }]
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
                            color: 'black',
                            font: {
                                family: 'Roboto',
                                size: 13,
                            }
                        },
                    },
                    y: {
                        min: 400,
                        max: 800,
                        beginAtZero: false,
                        ticks: {
                            stepSize: 100,
                            callback: function(value) {
                                return value.toFixed(2).replace('.', ',');
                            },
                            color: 'black',
                            font: {
                                family: 'Roboto',
                                size: 13,
                            }
                        },
                        grid: {
                            drawBorder: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                        },
                        border: {
                            display: true,
                            color: 'black',
                            width: 1
                        },
                    }
                },
                plugins: {
  
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'start',
                        labels: {
                            padding: 0,
                            color: 'black',
                            font: {
                                family: 'Roboto',
                                size: '12',
                            },
                            boxWidth: 20,
                            boxHeight: 1
                        }
                    }
                },
                
                interaction: {
                  mode: 'nearest', // Mengatur mode interaksi
                  axis: 'x', // Mengatur interaksi pada sumbu x
                  intersect: false // Menentukan apakah tooltip muncul hanya saat kursor berada tepat di atas titik
              },
              hover: {
                  animationDuration: 1
            }
          }
        });
  
        // Event listener untuk kotak centang bulan
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateChart(data, myChart);
                updateLineChart(data, lineChart);
            });
        });
  
        function updateChart(data, chart) {
            const checkedMonths = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => parseInt(checkbox.value));
            salesData = new Array(7).fill(0);
  
            data.forEach(item => {
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
  
        function updateLineChart(data, chart) {
            const checkedMonths = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => parseInt(checkbox.value));
            incomeData = new Array(12).fill(0);
  
            data.forEach(item => {
                const date = new Date(item.date);
                const month = date.getMonth(); // 0 (January) to 11 (December)
  
                if (checkedMonths.includes(month + 1)) {
                    incomeData[month] += parseFloat(item.price);
                }
            });
  
            chart.data.datasets[0].data = incomeData;
            chart.update();
        }
  
        // Fungsi untuk menceklis semua checkbox
        window.checkAll = function() {
            checkboxes.forEach(checkbox => checkbox.checked = true);
            updateChart(data, myChart);
            updateLineChart(data, lineChart);
        };
  
        // Fungsi untuk menunceklis semua checkbox
        window.uncheckAll = function() {
            checkboxes.forEach(checkbox => checkbox.checked = false);
            updateChart(data, myChart);
            updateLineChart(data, lineChart);
        };
  
        // Panggil fungsi untuk menginisialisasi chart
        updateChart(data, myChart);
        updateLineChart(data, lineChart);
    })
    .catch(error => console.error('Error fetching JSON:', error));
  });
  
  
  function myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function filterFunction() {
      var input, filter, div, label, i;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      div = document.getElementById("myDropdown");
      label = div.getElementsByTagName("label");
      for (i = 0; i < label.length; i++) {
          txtValue = label[i].textContent || label[i].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
              label[i].style.display = ""; // Tampilkan label jika cocok dengan pencarian
              label[i].previousElementSibling.style.display = ""; // Tampilkan checkbox sebelum label
          } else {
              label[i].style.display = "none"; // Sembunyikan label jika tidak cocok dengan pencarian
              label[i].previousElementSibling.style.display = "none"; // Sembunyikan checkbox sebelum label
          }
      }
  }
