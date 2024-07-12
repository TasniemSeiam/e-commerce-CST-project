document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "unauthorized.html"; // Redirect to an unauthorized access page
  }

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
    productsReview: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const productsTable = `
      <h2>All Pending Products</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Approve Action</th>
          <th>Refuse Action</th>
        </tr>
      </thead>
      <tbody>
      ${allUsers
        .flatMap((user) =>
          user.pendingProducts.map(
            (pendingProducts) => `
             <tr data-product-id="${pendingProducts.id}" data-seller-id="${user.id}">
              <td><img src="${pendingProducts.image[0]}" alt="${pendingProducts.title}" width="50" height="50"></td>
              <td>${pendingProducts.title}</td>
              <td>${pendingProducts.discount}</td>
              
                 <td>
                  <button class="approve-order-btn mahmoud" data-product-id="${pendingProducts.id}" data-seller-id="${user.id}">Approve Product</button>
                </td>
                <td>
                  <button class="refuse-order-btn" data-product-id="${pendingProducts.id}" data-seller-id="${user.id}">Refuse Product</button>
                </td>
                
             
            </tr>
        `
          )
        )
        .join("")}
      </tbody>
    </table>
    `;
      return productsTable;
    },
    orders: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const orderTable = `
      <h2>All Orders</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Order Date</th>
          <th>Tracking Status</th>
          <th>Total Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${allUsers
          .flatMap((user) =>
            user.orders.map(
              (order) =>
                `
              
          <tr data-id="${order.orderId}">
            <td>${order.orderId}</td>
            <td>${order.orderDate}</td>
            <td>${order.trackingStatus || "Order Processed"}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><button class="details">Order Details</button></td>
          </tr>
        `
            )
          )
          .join("")}
      </tbody>
    </table>
    `;
      return orderTable;
    },

    feedback: function () {
      // This function should fetch the feedback data and re-render the table
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];

      const feedbackTable = `
      <h2>User Feedback and Customer Service</h2>
      
      <table id="feedback-table" class="table">
        <thead>
          <tr>
            <th>User Type</th>
            <th>Feedback Type</th>
            <th>Email</th>
            <th>Feedback</th>
            <th>Response</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="feedback-tbody" class="feedback-table">
         ${allUsers
           .flatMap((user) =>
             user.feedback.map(
               (feedbackUser) =>
                 `
              
          <tr data-id="${feedbackUser.feedbackId}">
            <td>${feedbackUser.name}</td>
            <td>${feedbackUser.feedbackType}</td>
            <td>$${feedbackUser.email}</td>
            <td>$${feedbackUser.feedback}</td>
            <td>$${feedbackUser.response}</td>
            <td>$${feedbackUser.action}</td>
          </tr>
        `
             )
           )
           .join("")}
        </tbody>
      </table>
      <div id="search-message"></div>
    `;
      return feedbackTable;
    },
  };

  let products = JSON.parse(localStorage.getItem("products")) || [];
  console.log(products);

  function getAllPendingProducts() {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const pendingProducts = allUsers.flatMap((user) => user.pendingProducts);
    return pendingProducts;
  }

  // Use event delegation to listen for clicks on dynamically created buttons
  document.addEventListener("click", (e) => {
    if (
      e.target &&
      e.target.classList.contains("approve-order-btn") &&
      e.target.classList.contains("mahmoud")
    ) {
      const productId = e.target.dataset.productId;
      const sellerId = e.target.dataset.sellerId;
      console.log(productId, sellerId);
      approveProduct(productId, sellerId);
    }
  });

  // Populate the table with pending products

  function approveProduct(productId, sellerId) {
    console.log("Approving product with ID:", productId);

    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    const pendingProducts = getAllPendingProducts();

    // Find the product in the pendingProducts array
    const productIndex = pendingProducts.findIndex(
      (product) => product.id === +productId
    );

    if (productIndex !== -1) {
      const product = pendingProducts[productIndex];

      // Add the product to the products array in local storage
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products)); // Update here

      // Remove the product from the pendingProducts array in usersData
      const userIndex = usersData.findIndex((user) => user.id === sellerId);
      if (userIndex !== -1) {
        const user = usersData[userIndex];
        const pendingProductIndex = user.pendingProducts.findIndex(
          (p) => p.id === +productId
        );
        if (pendingProductIndex !== -1) {
          user.pendingProducts.splice(pendingProductIndex, 1);
          // Update the usersData in local storage
          localStorage.setItem("users", JSON.stringify(usersData));
        }
      }

      console.log(
        "Product approved successfully and added to products in localStorage"
      );
    } else {
      console.log("Product not found in pendingProducts");
    }
  }

  function displayContent(section) {
    if (typeof sections[section] === "function") {
      contentDiv.innerHTML = sections[section]();
    } else {
      contentDiv.innerHTML = sections[section];
    }
    if (section === "dashboard") {
      displayProductCategoriesChart();
      displayUserRolesChart();
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
          ${
            user.role !== "admin"
              ? '<button class="btn btn-danger btn-sm">Delete</button>'
              : ""
          }
        </td>
        `;

        if (user.role !== "admin") {
          const deleteButton = row.querySelector(".btn-danger");
          deleteButton.addEventListener("click", () => deleteUser(user.id));
        }

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

  function fetchFeedback() {
    const feedbackTbody = document.getElementById("feedback-tbody");
    feedbackTbody.innerHTML = "";
    const usersDataFeedBack = JSON.parse(localStorage.getItem("users")) || [];
    usersDataFeedBack.forEach((user, userIndex) => {
      if (user.feedback) {
        user.feedback.forEach((feedback, feedbackIndex) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>${user.username ? "customer" : "Visitor"}</td>
                    <td>${feedback.feedbackType}</td>
                    <td>${feedback.email}</td>
                    <td>${
                      feedback.feedbackType === "general"
                        ? feedback.feedback
                        : feedback.feedback.productFeedback
                    }</td>
                    <td>${feedback.response || ""}</td>
                    <td><button class="btn btn-primary btn-sm">Respond</button></td>
                `;
          const respondButton = row.querySelector(".btn-primary");
          respondButton.addEventListener("click", () =>
            respondFeedback(userIndex, feedbackIndex)
          );
          feedbackTbody.appendChild(row);
        });
      }
    });
  }

  function respondFeedback(userIndex, feedbackIndex) {
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    if (userIndex !== -1) {
      if (feedbackIndex !== -1) {
        // Show the modal
        $("#responseModal").modal("show");

        // Set up modal fields
        $("#responseTextarea").val(
          usersData[userIndex].feedback[feedbackIndex].response || ""
        );

        // Save response function
        saveResponse = function () {
          const response = $("#responseTextarea").val().trim();
          if (response) {
            usersData[userIndex].feedback[feedbackIndex].response = response;
            localStorage.setItem("users", JSON.stringify(usersData));
            fetchFeedback(); // Refresh the feedback table
            $("#responseModal").modal("hide");
          }
        };
      }
    }
  }

  // Event listeners for navigation buttons
  document
    .getElementById("feedback-btn")
    .addEventListener("click", function () {
      displayContent("feedback");
      setActiveButton("feedback-btn");
      fetchFeedback();
    });

  function addApproveOrderEventListeners() {
    const approveButtons = document.querySelectorAll(".approve-order-btn");
    approveButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = button.closest("tr");
        const productId = row.getAttribute("data-product-id");
        const sellerId = row.getAttribute("data-seller-id");
        approveProduct(productId, sellerId);
      });
    });
  }

  function openOrderDetailsModal(order, orderItems) {
    $("#orderDetailsModal").modal("show");
    const orderDetailsBody = document.getElementById("order-details-body");
    orderDetailsBody.innerHTML = `
      <h2>Order Data</h2>
      <p>Order ID: ${order.orderId}</p>
      <p>Total Price: $${order.total.toFixed(2)}</p>
      <p>Address: ${order.orderData.address}</p>
      <p>City: ${order.orderData.city}</p>
      <p>email: ${order.orderData.email}</p>
      <p>Name: ${order.orderData.fname}</p>
      <p>Mobile Number: ${order.orderData.pnumber}</p>
      <table class="order-items">
        <thead>
          <tr>
            <th style="background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;">Product Name</th>
            <th style="background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;">Quantity</th>
            <th style="background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems
            .map(
              (item) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #ccc;">$${item.price}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
    const closeButtons = document.querySelectorAll(
      "#orderDetailsModal .close, #orderDetailsModal .btn-close"
    );
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        $("#orderDetailsModal").modal("hide");
      });
    });
  }

  document
    .getElementById("products-review-btn")
    .addEventListener("click", function () {
      displayContent("productsReview");
      setActiveButton("products-review-btn");
    });

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
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    document.querySelectorAll(".details").forEach((button) => {
      button.addEventListener("click", function (e) {
        const orderId = Number(e.target.closest("tr").dataset.id);
        const order = allUsers
          .flatMap((user) => user.orders)
          .find((order) => order.orderId === orderId);
        const orderItems = order.orderItems;
        const orderItemsArray = Object.values(orderItems);
        console.log(orderItemsArray);
        openOrderDetailsModal(order, orderItemsArray);
      });
    });
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
