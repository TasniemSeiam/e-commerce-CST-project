document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");

  const sections = {
    dashboard: `
    <h2>Dashboard</h2><p class="text-muted mt-n3 ml-5">powered by canvas</p>
    <div class="chart-container">
        <canvas id="userRolesChart" width="450" height="450"></canvas>
        <canvas id="productCategoriesChart" width="450" height="450"></canvas>
    </div>
    `,
    users: `
      <h2>All Users</h2>
      <div class="search">
        <input
          type="search"
          placeholder="search for users..."
          aria-label="Search"
          class="form-control w-55 border-1 border-warning p-2"
          oninput="searchTable('users-tbody')"
        />
      </div>
      <table id="users-table" class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="users-tbody" class="all-users-table"></tbody>
      </table>
      <div id="search-message"></div>
    `,
    products: `
      <h2>All Products</h2>
      <div class="search">
        <input
          type="search"
          placeholder="search for products..."
          aria-label="Search"
          class="form-control w-55 border-1 border-warning p-2"
          oninput="searchTable('product-tbody')"
        />
      </div>
      <table id="products-table" class="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="product-tbody" class="all-products-table"></tbody>
      </table>
      <div id="search-message"></div>
    `,
    orders: `
      <h2>All Orders</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Mobile number</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1001</td>
            <td>Mahmoud</td>
            <td>01234567891</td>
            <td>$30.00</td>
          </tr>
          <tr>
            <td>1002</td>
            <td>Ahmed</td>
            <td>01234567891</td>
            <td>$50.00</td>
          </tr>
        </tbody>
      </table>
    `,
  };

  function displayContent(section) {
    contentDiv.innerHTML = sections[section];
    if (section === "dashboard") {
      displayUserRolesChart();
      displayProductCategoriesChart();
    }
  }

  function setActiveButton(activeButtonId) {
    const buttons = document.querySelectorAll(".left button");
    buttons.forEach((button) => {
      button.classList.remove("active");
    });
    document.getElementById(activeButtonId).classList.add("active");
  }

  const usersData = JSON.parse(localStorage.getItem("users"));
  function fetchUsers() {
    const usersTbody = document.getElementById("users-tbody");
    usersTbody.innerHTML = "";

    if (usersData && Array.isArray(usersData)) {
      usersData.forEach((user) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", user.id);
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn btn-danger btn-sm">Delete</button>
          </td>
        `;

        const deleteButton = row.querySelector(".btn-danger");
        deleteButton.addEventListener("click", () => deleteUser(user.id));

        usersTbody.appendChild(row);
      });
    } else {
      usersTbody.innerHTML = "<tr><td colspan='5'>No users found.</td></tr>";
    }
  }

  function deleteUser(id) {
    const users = JSON.parse(localStorage.getItem("users"));
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      if (confirm("Are you sure you want to delete this user?")) {
        const updatedUsers = [...users];
        updatedUsers.splice(userIndex, 1);

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        // Remove the row from the DOM
        const row = document.querySelector(`tr[data-id='${id}']`);
        if (row) {
          row.remove();
        }
      }
    } else {
      console.error("User with username", username, "not found");
    }
  }

  const productsData = JSON.parse(localStorage.getItem("products"));

  function fetchProducts() {
    const productTbody = document.getElementById("product-tbody");
    productTbody.innerHTML = "";
    if (productsData && Array.isArray(productsData)) {
      productsData.forEach((product) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", product.id);
        row.innerHTML = `
              
              <td><img src="${product.image[0]}" alt="${
          product.title
        }" width="80" height="80"></td>
              <td>${product.title}</td>
              <td>$${product.discount.toFixed(2)}</td>
              <td><button class="btn btn-danger btn-sm">Delete</button></td>
            `;
        const deleteButton = row.querySelector(".btn-danger");
        deleteButton.addEventListener("click", () => deleteProduct(product.id));
        productTbody.appendChild(row);
      });
    } else {
      productTbody.innerHTML =
        "<tr><td colspan='5'>No products found.</td></tr>";
    }
  }

  function deleteProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"));
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex !== -1) {
      if (confirm("Are you sure you want to delete this product?")) {
        const updatedProducts = [...products];
        updatedProducts.splice(productIndex, 1);

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        // Remove the row from the DOM
        const row = document.querySelector(`tr[data-id='${id}']`);
        if (row) {
          row.remove();
        }
      }
    } else {
      console.error("Product with id", id, "not found");
    }
  }

  document
    .getElementById("dashboard-btn")
    .addEventListener("click", function () {
      displayContent("dashboard");
      setActiveButton("dashboard-btn");
    });

  document.getElementById("users-btn").addEventListener("click", function () {
    displayContent("users");
    setActiveButton("users-btn");
    fetchUsers();
  });

  document
    .getElementById("products-btn")
    .addEventListener("click", function () {
      displayContent("products");
      setActiveButton("products-btn");
      fetchProducts();
    });

  document.getElementById("orders-btn").addEventListener("click", function () {
    displayContent("orders");
    setActiveButton("orders-btn");
  });

  displayContent("dashboard");
});

function searchTable(tbodyId) {
  let input, filter, table, tr, td, i, j, txtValue;
  input = document.querySelector(".search input");
  filter = input.value.toUpperCase();
  table = document.getElementById(tbodyId).parentNode;
  tr = table.getElementsByTagName("tr");

  for (i = 1; i < tr.length; i++) {
    // start from 1 to skip header row
    tr[i].style.display = "none";
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }

  // Search filter
  let matchingRecords = 0;
  for (i = 1; i < tr.length; i++) {
    // start from 1 to skip header row
    if (tr[i].style.display !== "none") {
      matchingRecords++;
    }
  }

  if (matchingRecords === 0) {
    document.getElementById("search-message").innerHTML =
      "No matching data found.";
  } else {
    document.getElementById("search-message").innerHTML = "";
  }
}

// display User Roles Pie Chart
function displayUserRolesChart() {
  const usersData = JSON.parse(localStorage.getItem("users"));
  const rolesCount = usersData.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const roleLabels = Object.keys(rolesCount);
  const roleValues = Object.values(rolesCount);

  new Chart(document.getElementById("userRolesChart"), {
    type: "pie",
    data: {
      labels: roleLabels,
      datasets: [
        {
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          data: roleValues,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Users by Role",
      },
    },
  });
}

// display Product Categories Pie Chart
function displayProductCategoriesChart() {
  const productsData = JSON.parse(localStorage.getItem("products"));
  const categoriesCount = productsData.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoriesCount);
  const categoryValues = Object.values(categoriesCount);

  new Chart(document.getElementById("productCategoriesChart"), {
    type: "pie",
    data: {
      labels: categoryLabels,
      datasets: [
        {
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#1611AA",
            "#FF5317",
          ],
          data: categoryValues,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Products by Category",
      },
    },
  });
}
