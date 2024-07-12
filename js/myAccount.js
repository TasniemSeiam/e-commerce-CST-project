import { currentUser } from "./config.js";
import { getCategories } from "./sharedHome.js";
document.addEventListener("DOMContentLoaded", function () {
  const email = document.querySelector(".email-user");
  const userName = document.querySelector(".username-user");

  // Fetch user data and wishlist items from localStorage
  let user = JSON.parse(localStorage.getItem("currentUser")) || {};
  let userWishList = user.wishList || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];

  email.innerHTML = `${user.email}`;
  userName.innerHTML = `${user.username}`;

  console.log("User data loaded:", user);
  console.log("User wishlist:", userWishList);
  console.log("Products data:", products);

  // Function to render orders dynamically
  function renderOrders() {
    console.log("renderOrders() function called");
    const ordersContainer = document.getElementById("orders-list");
    if (!ordersContainer) {
      console.error("Orders container not found in the DOM.");
      return;
    }
    ordersContainer.innerHTML = ""; // Clear existing content

    console.log("Rendering orders...");

    if (!user.orders || user.orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
    } else {
      user.orders.forEach((order) => {
        console.log("Order:", order); // Log the order to check its structure
        if (Array.isArray(order.orderItems)) {
          let orderItemsHtml = "";
          order.orderItems.forEach((item) => {
            orderItemsHtml += `
              <li class="list-group-item">
                Product: ${item.name}, Quantity: ${item.quantity}, Price: ${item.price}
              </li>`;
          });

          ordersContainer.innerHTML += `
            <div class="order mb-4">
              <h3>Order ID: ${order.orderId}</h3>
              <p>Total: ${order.total.toFixed(2)}</p>
              <ul class="list-group">
                ${orderItemsHtml}
              </ul>
            </div>`;
        } else {
          console.error(
            `orderItems is not an array for order ID ${order.orderId}`
          );
          ordersContainer.innerHTML += `
            <div class="order mb-4">
              <h3>Order ID: ${order.orderId}</h3>
              <p>Total: ${order.total}</p>
              <p>Error: Order items are not available.</p>
            </div>`;
        }
      });
    }
  }

  // Function to render feedback with responses
  function renderFeedbackWithResponses() {
    const feedbackContainer = document.getElementById("feedback-list");
    if (!feedbackContainer) {
      console.error("Feedback container not found in the DOM.");
      return;
    }
    feedbackContainer.innerHTML = ""; // Clear existing content

    if (!user.feedback || user.feedback.length === 0) {
      feedbackContainer.innerHTML = "<p>No feedback given.</p>";
    } else {
      user.feedback.forEach((feedback) => {
        const response = user.feedbackResponse.find(
          (resp) => resp.feedbackId === feedback.id
        );

        feedbackContainer.innerHTML += `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Feedback:</h5>
              <p class="card-text">${
                feedback.feedbackType === "general"
                  ? feedback.feedback
                  : feedback.feedback.productFeedback
              }</p>
              <h5 class="card-title">Feedback Type:</h5>
              <p class="card-text">${
                feedback.feedbackType === "general"
                  ? feedback.feedbackType
                  : "Product Name  : " + feedback.feedback.productName
              }</p>
              <h5 class="card-title">Response:</h5>
              <p class="card-text">${
                feedback.response ? feedback.response : "No response yet."
              }</p>
            </div>
          </div>
        `;
      });
    }
  }

  // Function to render wishlist items
  function renderWishlistItems() {
    const wishlistContainer = document.getElementById("wishlist-items");
    if (!wishlistContainer) {
      console.error("Wishlist container not found in the DOM.");
      return;
    }
    wishlistContainer.innerHTML = ""; // Clear existing content

    if (userWishList.length === 0) {
      wishlistContainer.innerHTML = "<p>No items in your wishlist.</p>";
    } else {
      userWishList.forEach((productId) => {
        console.log("Checking product ID:", productId);
        let product = products.find((p) => +p.id === +productId.id);
        console.log(product.id);
        if (product) {
          wishlistContainer.innerHTML += `
            <li class="wishlist-item list-group-item d-flex align-items-center">
              <img src="${product.image[0]}" alt="${product.title}" class="me-3" style="max-width: 50px;">
              <a href="productdetails.html?id=${product.id}">${product.title}</a>
              <button type="button" class="btn btn-danger btn-sm ms-auto remove-item-btn" data-product-id="${product.id}">Remove</button>
            </li>
          `;
        } else {
          console.log(`Product with ID ${productId} not found`);
        }
      });

      // Add event listener for remove buttons
      const removeButtons =
        wishlistContainer.querySelectorAll(".remove-item-btn");
      removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productId = button.getAttribute("data-product-id");
          console.log("Removing product with ID:", productId);

          // Remove from wishlist and update localStorage
          removeFromWishlist(+productId);
        });
      });
    }
  }

  // Function to remove item from wishlist
  function removeFromWishlist(productId) {
    console.log("Wishlist before removal:", user.wishList);
    const wishlistIndex = user.wishList.findIndex(
      (item) => item.id === productId
    );
    if (wishlistIndex > -1) {
      user.wishList.splice(wishlistIndex, 1);
      console.log("Updated wishlist:", user.wishList);

      // Update the users array in localStorage
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUserIndex = users.findIndex((u) => u.id === user.id);
      if (currentUserIndex > -1) {
        users[currentUserIndex].wishList = user.wishList;
        localStorage.setItem("users", JSON.stringify(users));
      } else {
        console.error("Current user not found in users localStorage.");
      }

      // Update localStorage with the updated currentUser
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Re-render wishlist items
      renderWishlistItems();
    } else {
      console.log(`Product ID ${productId} not found in wishlist`);
    }
  }

  // Intial Renders
  renderOrders();
  renderWishlistItems();
  renderFeedbackWithResponses();
  // Displaying current user
  currentUser();
});

let selsectSearch = document.querySelector(".selsectSearch");
let searchInput = document.querySelector(".searchInput");
let getProduct = JSON.parse(localStorage.getItem("products")) || [];
getCategories(getProduct).forEach((cat) => {
  let option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  selsectSearch.appendChild(option);
  searchInput.addEventListener("focus", () => {
    window.location.href = "../productsSearch.html?";
  });
}); // search select option
