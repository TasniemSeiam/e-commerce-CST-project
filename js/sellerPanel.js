// import { currentUser,showToastUser } from "./config.js";
function currentUser() {
  let checkLogOut = document.querySelector(".user__check");
  let welcomeMessage = document.querySelector(".welcoming__message");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage) {
      // Display the toast message
      // Clear the login message from localStorage
      localStorage.removeItem("loginMessage");
    }
    checkLogOut.innerHTML = "Logout";
    welcomeMessage.innerHTML = `Welcome Back ${currentUser.username} 👋`;
  }

  // Logout functionality
  if (currentUser) {
    checkLogOut.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      localStorage.setItem("logoutMessage", "You have been logged out.");
      checkLogOut.innerHTML = "Sign-In";
      welcomeMessage.innerHTML = "Welcome to ITI Marketplace";
      window.location.href = "login.html"; // Redirect to login page
    });
  }
}

currentUser();
document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "seller") {
    window.location.href = "unauthorized.html"; // Redirect to an unauthorized access page
  }

  const sections = {
    dashboard: `<h2>Dashboard</h2><p class="text-muted mt-n3 ml-5">powered by canvas</p>
    <div class="chart-container">
        <canvas id="productCategoriesChart" width="450" height="450"></canvas>
        <canvas id="ordersOverviewChart" width="400" height="400"></canvas>
    </div>`,
    ordersSummary: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];

      let totalRevenue = 0;
      let netProfit = 0;
      let deliveredOrdersCount = 0;
      let totalOrdersCount = 0;

      allUsers.forEach((user) => {
        user.orders.forEach((order) => {
          totalOrdersCount++;
          if (order.trackingStatus === "Delivered") {
            totalRevenue += order.total;
            deliveredOrdersCount++;
          }
        });
      });

      netProfit = totalRevenue * 0.2;

      const pendingOrdersCount = totalOrdersCount - deliveredOrdersCount;

      const summaryHTML = `
        <h2>Orders Summary</h2>
        <div class="summary">
          <p>Total Revenue from Delivered Orders: $${totalRevenue.toFixed(
            2
          )}</p>
          <p>Net Profit (20% of Revenue): $${netProfit.toFixed(2)}</p>
          <p>Pending Orders: ${pendingOrdersCount}</p>
        </div>
      `;
      return summaryHTML;
    },
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
      <div class="table-responsive" >
      <table class="table" id="products-table">
        <thead>
          <tr>
            <th class="hide-column">Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="product-tbody">
        </tbody>
      </table>
      </div>
      <div id="search-message"></div>
    `,
    productsReview: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      console.log(allUsers);
      const productsTable = `
      <h2>All Pending Products</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
      ${allUsers
        .flatMap((user) =>
          user.pendingProducts.map(
            (pendingProducts) => `
            <tr>
              <td><img src="${pendingProducts.image[0]}" alt="${pendingProducts.title}" width="50" height="50"></td>
              <td>${pendingProducts.title}</td>
              <td>${pendingProducts.discount}</td>
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
    newProduct: `
    <h2>Add a new Product</h2>
    <div class="col-12 col-md-6">
      <label for="pname"> Product Name</label>
      <input
        type="text"
        class="form-control"
        id="pname"
        name="pname"
        placeholder="Enter your Product name here..."
        required
      />
      <div id="pnameError" class="error"></div>
      <label for="desc"> Description</label>
      <textarea
        rows="3"
        class="form-control"
        id="desc"
        name="desc"
        class="desc"
        placeholder="Product description..."
        required
      ></textarea>
      <div id="descError" class="error"></div>
      <div class="price">
        <label for="price"> Price</label>
        <input
          type="number"
          class="form-control"
          id="price"
          name="price"
          required
        />
        <div id="priceError" class="error"></div>
        <label for="discPrice"> Discounted Price</label>
        <input type="number" class="form-control" id="discPrice" name="discPrice" />
        <div id="discPriceError" class="error"></div>
      </div>
      <div class="category">
        <label for="category">Category: </label>
        <select name="category" id="category" class="category" required>
            <option value="">Select Your Category</option>
            <option value="men's clothing">men's clothing</option>
            <option value="jewelery">jewelery</option>
            <option value="electronics">electronics</option>
            <option value="women's clothing">women's clothing</option>
            <option value="mobile phones">mobile phones</option>
            <option value="furniture">furniture</option>
            <option value="cosmetics">cosmetics</option>
        </select>
        <div id="categoryError" class="error"></div>
      </div>
      <div class="rating">
        <label for="rate"> Rating</label>
        <input
          type="number"
          class="form-control"
          id="rate"
          name="rate"
          placeholder="Order Rate from 5"
          min="1"
          max="5"
          required
        />
        <div id="rateError" class="error"></div>
        <label for="count">Product Quantity</label>
        <input type="number" class="form-control" id="count" name="count" />
        <div id="countError" class="error"></div>
      </div>
      <div class="imgUpload">
        <label for="images">Upload Your Product Images</label>
        <input type="file" name="images" id="images" multiple required>
        <div id="imagesError" class="error"></div>
      </div>
      <button class="btn save-product" id="save-product-btn">Save your product</button>
    </div>
    `,
    orders: function () {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const orderTable = `
      <h2>All Orders</h2>
      <div class="table-responsive" >
      <table class="table align-middle ordersTable">
        <thead>
          <tr>
            <th scope="col" class="text-center">Order ID</th>
            <th scope="col" class="text-center">Order Date</th>
            <th scope="col" class="text-center">Tracking Status</th>
            <th scope="col" class="text-center">Total Price</th>
            <th scope="col" class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          ${allUsers
            .flatMap((user) =>
              user.orders.map(
                (order) => `
           <tr data-id="${order.orderId}">
            <td class="text-center" scope="row" >${order.orderId}</td>
            <td  class="text-center">${order.orderDate}</td>
            <td class=" justify-content-center align-items-center d-flex  flex-sm-row gap-2 py-3 " >
              <select class="tracking-status selectOrderStatus p-1 " style="width:150px" >
                <option value="Order Processed" ${
                  order.trackingStatus === "Order Processed" ? "selected" : ""
                }>Order Processed</option>
                <option value="Out for Delivery" ${
                  order.trackingStatus === "Out for Delivery" ? "selected" : ""
                }>Out for Delivery</option>
                <option value="Delivered" ${
                  order.trackingStatus === "Delivered" ? "selected" : ""
                }>Delivered</option>
              </select>
              <button class="save-tracking p-1 px-2 rounded bg-success text-white">save</button>
            </td>
            <td class="text-center " >$${order.total.toFixed(2)}</td>
            <td class="text-center" ><button class="details">Order Details</button>
            </td>
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
  };

  function displayContent(section) {
    if (typeof sections[section] === "function") {
      contentDiv.innerHTML = sections[section]();
    } else {
      contentDiv.innerHTML = sections[section];
    }
    if (section === "dashboard") {
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

  const productsData = JSON.parse(localStorage.getItem("products")) || [];

  function fetchProducts() {
    const productTbody = document.getElementById("product-tbody");
    productTbody.innerHTML = "";
    if (productsData && Array.isArray(productsData)) {
      productsData.forEach((product) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", product.id);
        row.innerHTML = `
              <td class="hide-column"><img src="${product.image[0]}" alt="${
          product.title
        }" width="80" height="80"></td>
              <td>${product.title}</td>
              <td>$${product.discount.toFixed(2)}</td>
              <td><button class="btn btn-success btn-sm">Edit</button></td>
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

  function openEditModal(product) {
    $("#editProductModal").modal("show");
    document.getElementById("edit-pname").value = product.title;
    document.getElementById("edit-desc").value = product.description;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-discPrice").value = product.discount;
    document.getElementById("edit-category").value = product.category;
    document.getElementById("edit-rate").value = product.rating.rate;
    document.getElementById("edit-count").value = product.rating.count;
    document.getElementById("edit-product-form").dataset.productId = product.id;
  }

  function saveChanges(event) {
    event.preventDefault();
    const productId = parseInt(
      document.getElementById("edit-product-form").dataset.productId
    );
    const pname = document.getElementById("edit-pname").value;
    const desc = document.getElementById("edit-desc").value;
    const price = parseFloat(document.getElementById("edit-price").value);
    const discPrice = parseFloat(
      document.getElementById("edit-discPrice").value
    );
    const category = document.getElementById("edit-category").value;
    const rate = Math.round(document.getElementById("edit-rate").value);
    const count = parseInt(document.getElementById("edit-count").value);
    const images = document.getElementById("edit-images").files;

    // Validate the discounted price
    if (discPrice >= price) {
      document.getElementById(
        "edit-discPriceError"
      ).textContent = `Discounted price must be less than ${price}`;
      return; // Prevent form submission
    }

    let product = productsData.find((p) => p.id === productId);

    if (product) {
      product.title = pname;
      product.description = desc;
      product.price = price;
      product.discount = discPrice;
      product.category = category;
      product.rating.rate = rate;
      product.rating.count = count;

      if (images.length > 0) {
        const readImagesAsBase64 = async () => {
          const imageUrls = [];
          for (const image of images) {
            const base64String = await toBase64(image);
            imageUrls.push(base64String);
          }
          return imageUrls;
        };

        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });

        readImagesAsBase64().then((imageUrls) => {
          product.image = imageUrls;
          localStorage.setItem("products", JSON.stringify(productsData));
          fetchProducts();
          $("#editProductModal").modal("hide");
        });
      } else {
        localStorage.setItem("products", JSON.stringify(productsData));
        fetchProducts();
        $("#editProductModal").modal("hide");
      }
    }
  }

  function addProduct(event) {
    event.preventDefault();
    const pname = document.getElementById("pname").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const discPrice = parseFloat(document.getElementById("discPrice").value);
    const category = document.getElementById("category").value;
    const rate = parseFloat(document.getElementById("rate").value);
    const count = parseInt(document.getElementById("count").value);
    const images = document.getElementById("images").files;

    let isValid = true;

    // Clear previous error messages
    document.getElementById("pnameError").textContent = "";
    document.getElementById("descError").textContent = "";
    document.getElementById("priceError").textContent = "";
    document.getElementById("discPriceError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("rateError").textContent = "";
    document.getElementById("countError").textContent = "";
    document.getElementById("imagesError").textContent = "";

    // Validate inputs
    if (!pname || !/\S/.test(pname)) {
      document.getElementById("pnameError").textContent =
        "You must enter a valid product name.";
      isValid = false;
    }
    if (!desc || !/\S/.test(desc)) {
      document.getElementById("descError").textContent =
        "You must enter a valid description.";
      isValid = false;
    }
    if (!price) {
      document.getElementById("priceError").textContent =
        "You must enter a price.";
      isValid = false;
    }
    if (!discPrice) {
      document.getElementById(
        "discPriceError"
      ).textContent = `You must enter a discounted price less than or equal ${price}`;
      isValid = false;
    }
    if (price < discPrice) {
      document.getElementById(
        "discPriceError"
      ).textContent = `Discounted price must be less than or equal ${price}`;
      isValid = false;
    }
    if (!category) {
      document.getElementById("categoryError").textContent =
        "You must select a category.";
      isValid = false;
    }
    if (!rate || rate > 5 || rate < 1) {
      document.getElementById("rateError").textContent =
        "You must enter a rating from 1 to 5.";
      isValid = false;
    }
    if (!count) {
      document.getElementById("countError").textContent =
        "Your product quantity must be greater than zero.";
      isValid = false;
    }
    if (images.length < 2) {
      document.getElementById("imagesError").textContent =
        "Please upload at least two images.";
      isValid = false;
    }

    // Check if the product name already exists
    const existingProduct = productsData.find(
      (product) => product.title.toLowerCase() === pname.toLowerCase()
    );
    if (existingProduct) {
      document.getElementById("pnameError").textContent =
        "This product name is already taken.";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const readImagesAsBase64 = async () => {
      const imageUrls = [];
      for (const image of images) {
        const base64String = await toBase64(image);
        imageUrls.push(base64String);
      }
      return imageUrls;
    };

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    function generateRandomId() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    readImagesAsBase64().then((imageUrls) => {
      const newProduct = {
        id: generateRandomId(),
        title: pname,
        description: desc,
        price: price,
        discount: discPrice,
        category: category,
        rating: { rate: rate, count: count },
        image: imageUrls,
      };

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const sellerUser = allUsers.find(
        (user) => user.id === currentUser.id && user.role === "seller"
      );

      if (sellerUser) {
        if (!sellerUser.pendingProducts) {
          sellerUser.pendingProducts = [];
        }
        sellerUser.pendingProducts.push(newProduct);
        localStorage.setItem("users", JSON.stringify(allUsers));
        alert("Product added for review!");
        displayContent("products");
        fetchProducts();
        setActiveButton("products-btn");
      } else {
        console.error("Seller user not found or invalid role.");
      }
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
    .getElementById("edit-product-form")
    .addEventListener("submit", saveChanges);

  document
    .getElementById("products-btn")
    .addEventListener("click", function () {
      displayContent("products");
      setActiveButton("products-btn");
      fetchProducts();

      document.querySelectorAll(".btn-success").forEach((button) => {
        button.addEventListener("click", function (e) {
          const productId = parseInt(e.target.closest("tr").dataset.id);
          const product = productsData.find((p) => p.id === productId);
          openEditModal(product);
        });
      });
    });

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

  document
    .getElementById("new-product-btn")
    .addEventListener("click", function () {
      displayContent("newProduct");
      setActiveButton("new-product-btn");

      document
        .getElementById("save-product-btn")
        .addEventListener("click", addProduct);
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

    document.querySelectorAll(".save-tracking").forEach((button) => {
      button.addEventListener("click", function (e) {
        const row = e.target.closest("tr");
        const orderId = Number(row.dataset.id);
        const newStatus = row.querySelector(".tracking-status").value;

        const userIndex = allUsers.findIndex((user) =>
          user.orders.some((order) => order.orderId === orderId)
        );
        const orderIndex = allUsers[userIndex].orders.findIndex(
          (order) => order.orderId === orderId
        );

        if (userIndex !== -1 && orderIndex !== -1) {
          allUsers[userIndex].orders[orderIndex].trackingStatus = newStatus;
          localStorage.setItem("users", JSON.stringify(allUsers));
          alert("Tracking status updated successfully!");
        } else {
          console.error("Order or user not found");
        }
      });
    });
  });

  // Display dashboard content by default
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
