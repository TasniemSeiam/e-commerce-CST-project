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
        <div class="mt-4" >
        <canvas id="ordersSummaryChart" width="700" height="700"></canvas>
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
      <div class="table-responsive align-middle mt-3" >
      <table id="users-table" class="table">
        <thead>
          <tr>
            <th scope="col" class="ps-4">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody id="users-tbody" class="all-users-table"></tbody>
      </table>
      </div>
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
      <div class="table-responsive align-middle mt-3" >
      <table id="products-table" class="table">
        <thead>
          <tr>
            <th scope="col"class="ps-4" >Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody id="product-tbody" class="all-products-table"></tbody>
      </table>
      </div>
      <div id="search-message"></div>
    `,
    productsReview: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const productsTable = `
      <h2>All Pending Products</h2>
      <div table-responsive align-middle>
      <table class="table tableApproved">
        <thead>
          <tr>
            <th scope="col" >Image</th>
            <th scope="col">Product Name</th>
            <th scope="col" class="text-center" >Price</th>
            <th scope="col" class="text-center">Approve Action</th>
            <th scope="col" class="text-center">Refuse Action</th>
          </tr>
        </thead>
        <tbody>
        ${allUsers
          .flatMap((user) => {
            if (user.pendingProducts) {
              return user.pendingProducts.map(
                (pendingProducts) => `
               <tr data-product-id="${pendingProducts.id}" data-seller-id="${user.id}">
                <td class="align-middle" ><img src="${pendingProducts.image[0]}" alt="${pendingProducts.title}" width="50" height="50"></td>
                <td class="align-middle text-capitalize">${pendingProducts.title}</td>
                <td class="align-middle fw-bold text-center">${pendingProducts.discount}</td>
                   <td class="align-middle text-center ">
                    <button class="approve-order-btn mahmoud  p-1 px-2 text-white rounded bg-success " data-product-id="${pendingProducts.id}" data-seller-id="${user.id}">Approve Product</button>
                  </td>
                  <td class="align-middle text-center">
                    <button class="refuse-order-btn p-1 px-2 text-light rounded bg-danger " data-product-id="${pendingProducts.id}" data-seller-id="${user.id}">Refuse Product</button>
                  </td>
                      
                   
              </tr>
          `
              );
            } else {
              return [];
            }
          })
          .join("")}
        </tbody>
      </table>
      </div>
    `;
      return productsTable;
    },
    orders: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const orderTable = `
      <h2>All Orders</h2>
      <div class="table-responsive align-middle text-center">
      <table class="table tableOrder">
        <thead>
          <tr>
            <th scope="col" class="ps-4 ps-sm-0" >Order ID</th>
            <th scope="col">Order Date</th>
            <th scope="col">Tracking Status</th>
            <th scope="col">Total Price</th>
            <th scope="col">Action</th>
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
      </div>
    `;
      return orderTable;
    },

    feedback: function () {
      // This function should fetch the feedback data and re-render the table
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];

      const feedbackTable = `
      <h2>User Feedback and Customer Service</h2>
      <div class="table-responsive align-middle">
      <table id="feedback-table" class="table feedback-table">
        <thead>
          <tr>
            <th scope="col" class="ps-4 ps-sm-0">User Type</th>
            <th scope="col" >Feedback Type</th>
            <th scope="col" >Email</th>
            <th scope="col" >Feedback</th>
            <th scope="col" >Response</th>
            <th scope="col" >Action</th>
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
      </div>
      <div id="search-message"></div>
    `;
      return feedbackTable;
    },

    resetPass: function () {
      const allUsers = JSON.parse(localStorage.getItem("userRequests")) || [];
      const resetPassTable = `
      <h2>Reset All Users Passwords</h2>
      <div class="table-responsive align-middle">
      <table id="resetPass-table" class="table ">
        <thead>
          <tr>
            <th scope="col" class="ps-4 ps-sm-0">User Mail</th>
            <th scope="col" >Action</th>
            <th scope="col" >Delete</th>
          </tr>
        </thead>
        <tbody id="resetPass-tbody" class="feedback-table">
        ${allUsers
          .map((user) => {
            return `
              <tr>
                <td>${user.email}</td>
                <td><button class="send-otp-btn" data-email="${user.email}">Send OTP</button></td>
                <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
      </div>
  `;
      return resetPassTable;
    },
    contactPeople: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const contactPeopleTable = `
      <h2>Our customer's opinions</h2>
      <table id="contactPeople-table" class="table">
        <thead>
          <tr>
            <th>Comment Date</th>
            <th>Username</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody id="contactPeople-tbody" class="feedback-table">
        ${allUsers
          .flatMap((user) =>
            user.comments.map(
              (comment) =>
                `
              <tr>
                <td>${comment.date}</td>
                <td>${comment.userName}</td>
                <td>${comment.comment}</td>
              </tr>
            `
            )
          )
          .join("")}
      </tbody>
    </table>
  `;
      return contactPeopleTable;
    },
  };

  // Add event listener to the refuse buttons

  const refuseButtons = document.querySelectorAll('[id^="refuse-btn-"]');
  refuseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = button.id.split("-")[2];
      refuseRequest(userId);
    });
  });

  document
    .getElementById("contactPeople-btn")
    .addEventListener("click", function () {
      displayContent("contactPeople");
      setActiveButton("contactPeople-btn");
    });

  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("send-otp-btn")) {
      const email = e.target.dataset.email;
      sendOTP(email);
    }

    if (e.target && e.target.classList.contains("delete-btn")) {
      const userId = e.target.dataset.id;
      deleteRequest(userId);
    }
  });

  function deleteRequest(id) {
    const allUsers = JSON.parse(localStorage.getItem("userRequests")) || [];
    const filteredUsers = allUsers.filter((user) => user.id !== id);
    localStorage.setItem("userRequests", JSON.stringify(filteredUsers));
    location.reload();
  }

  function sendOTP(email) {
    const OTP = Math.floor(100000 + Math.random() * 900000);

    const allUsers = JSON.parse(localStorage.getItem("userRequests")) || [];
    const updatedUsers = allUsers.map((user) => {
      if (user.email === email) {
        user.otp = OTP;
      }
      return user;
    });
    localStorage.setItem("userRequests", JSON.stringify(updatedUsers));

    // Find the button and update its text and disable it
    const sendOTPButtons = document.querySelectorAll(".send-otp-btn");
    sendOTPButtons.forEach((button) => {
      if (button.dataset.email === email) {
        button.textContent = "Sent";
        button.disabled = true;
      }
    });

    alert(`OTP sent to ${email}: ${OTP}`);
  }

  let products = JSON.parse(localStorage.getItem("products")) || [];

  function getAllPendingProducts() {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const pendingProducts = allUsers.flatMap((user) => user.pendingProducts);
    return pendingProducts;
  }

  document.querySelectorAll(".approve-order-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const sellerId = button.dataset.sellerId;
      approveProduct(productId, sellerId);
    });
  });

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

  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("refuse-order-btn")) {
      const productId = e.target.dataset.productId;
      const sellerId = e.target.dataset.sellerId;
      console.log(productId, sellerId);
      refuseProduct(productId, sellerId);
    }
  });

  // Populate the table with pending products

  function approveProduct(productId, sellerId) {
    console.log("Approving product with ID:", productId);

    // Get users data from localStorage
    let usersData = JSON.parse(localStorage.getItem("users")) || [];

    // Get all pending products
    let pendingProducts = getAllPendingProducts();

    // Find the product in the pendingProducts array
    let productIndex = pendingProducts.findIndex(
      (product) => product.id === Number(productId)
    );

    if (productIndex !== -1) {
      // Get the product to be approved
      const productToApprove = pendingProducts[productIndex];

      // Add approved product to the products list in localStorage
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(productToApprove);
      localStorage.setItem("products", JSON.stringify(products));

      const userIndex = usersData.findIndex((user) => user.id === +sellerId);
      if (userIndex !== -1) {
        const user = usersData[userIndex];
        const pendingProductIndex = user.pendingProducts.findIndex(
          (p) => p.id === Number(productId)
        );
        if (pendingProductIndex !== -1) {
          user.pendingProducts.splice(pendingProductIndex, 1);

          localStorage.setItem("users", JSON.stringify(usersData));

          alert("Product approved successfully!");

          removeUIRow(productId);

          setTimeout(() => {
            location.reload();
          }, 1000);

          console.log("Product approved successfully and removed from UI");
          return;
        }
      }
    }
    console.log(
      "Product approval failed or product not found in pendingProducts"
    );
    alert("Failed to approve product. Please try again.");
  }

  function refuseProduct(productId, sellerId) {
    console.log("Refusing product with ID:", productId);

    // Retrieve usersData from localStorage
    let usersData = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user in usersData array
    const userIndex = usersData.findIndex(
      (user) => user.id === Number(sellerId)
    );

    if (userIndex !== -1) {
      const user = usersData[userIndex];
      console.log(user);

      // Find the product in the user's pendingProducts array
      const pendingProductIndex = user.pendingProducts.findIndex(
        (p) => p.id === Number(productId)
      );

      if (pendingProductIndex !== -1) {
        const product = user.pendingProducts[pendingProductIndex];
        console.log(product);

        // Ask for confirmation before refusing
        const confirmRefusal = confirm(
          `Are you sure you want to refuse product ${productId}?`
        );

        if (confirmRefusal) {
          // Update the product status to "refused"
          product.status = "refused";

          // Remove the product from user's pendingProducts array
          user.pendingProducts.splice(pendingProductIndex, 1);

          // Update the usersData in local storage
          localStorage.setItem("users", JSON.stringify(usersData));
          removeRowFromUI(productId);

          setTimeout(() => {
            location.reload();
          }, 1000);

          console.log(
            "Product refused successfully and removed from pending products"
          );
        } else {
          console.log("Refusal cancelled by user.");
        }
      } else {
        console.log("Product not found in user's pendingProducts");
      }
    } else {
      console.log("User not found in usersData");
    }
  }

  function removeRowFromUI(productId) {
    // Example function assuming a table with rows identified by productId
    const rowToRemove = document.querySelector(
      `tr[data-product-id="${productId}"]`
    );
    if (rowToRemove) {
      rowToRemove.remove();
    }
  }
  let dashboardBtn = document.getElementById("dashboard-btn");
  dashboardBtn.addEventListener("click", () => {
   location.reload();
  });
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

  document
    .getElementById("resetPass-btn")
    .addEventListener("click", function () {
      displayContent("resetPass");
      setActiveButton("resetPass-btn");
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

function displayOrdersSummaryChart() {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const allOrders = allUsers.flatMap((user) => user.orders || []);

  // Debugging: Output to console to check data
  console.log(allOrders);

  const totalOrders = allOrders.length;
  console.log("Total Orders:", totalOrders);

  const deliveredOrders = allOrders.filter(
    (order) => order.trackingStatus === "Delivered"
  ).length;
  console.log("Delivered Orders:", deliveredOrders);

  const pendingOrders = totalOrders - deliveredOrders;
  console.log("Pending Orders:", pendingOrders);

  const totalRevenue = allOrders.reduce((acc, order) => {
    if (order.trackingStatus === "Delivered") {
      return acc + order.total;
    }
    return acc;
  }, 0);
  console.log("Total Revenue:", totalRevenue);

  const netProfit = totalRevenue * 0.05; // Assuming net profit is 20% of total revenue
  console.log("Net Profit:", netProfit);

  // Ensure DOM is fully loaded before accessing canvas element
  document.addEventListener("DOMContentLoaded", function () {
    // Create a new chart
    var ctx = document.getElementById("ordersSummaryChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Total Orders",
          "Delivered Orders",
          "Pending Orders",
          "Total Revenue",
          "Net Profit",
        ],
        datasets: [
          {
            label: "Orders Summary",
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            data: [
              totalOrders,
              deliveredOrders,
              pendingOrders,
              totalRevenue,
              netProfit,
            ],
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        title: {
          display: true,
          text: "Orders Summary",
        },
      },
    });
  });
}

// Call the function when the DOM is ready
displayOrdersSummaryChart();
