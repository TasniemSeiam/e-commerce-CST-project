import { showToastAdded } from "../js/sharedHome.js";

export function showToastUser(message, success = true, timeout = 3000) {
  // Create a new toast element
  const toastElement = document.createElement("div");
  toastElement.classList.add("toast");
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");

  // Set toast header
  const toastHeader = document.createElement("div");
  toastHeader.classList.add("toast-header");

  // Optional: You can add an icon or image to the toast header
  // const toastIcon = document.createElement("img");
  // toastIcon.src = "your-icon-path";
  // toastIcon.classList.add("rounded", "me-2");
  // toastIcon.setAttribute("alt", "...");

  const toastTitle = document.createElement("strong");
  toastTitle.classList.add("me-auto");
  toastTitle.textContent = "Notification"; // Set your own title

  const toastTime = document.createElement("small");
  toastTime.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  toastHeader.appendChild(toastTitle);
  toastHeader.appendChild(toastTime);

  // Set toast body
  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.textContent = message;

  // Set toast class based on success or error
  if (success) {
    toastElement.classList.add("bg-success", "text-white");
  } else {
    toastElement.classList.add("bg-danger", "text-white");
  }

  toastElement.appendChild(toastHeader);
  toastElement.appendChild(toastBody);

  // Add toast to toast container
  const toastContainer = document.getElementById("toastPlacement");
  toastContainer.innerHTML = ""; // Clear previous toasts if any
  toastContainer.appendChild(toastElement);

  // Initialize Bootstrap Toast and show it
  const bootstrapToast = new bootstrap.Toast(toastElement);
  bootstrapToast.show();

  // Hide toast after timeout
  setTimeout(function () {
    bootstrapToast.hide();
  }, timeout);
}

// Current User Functionality
export function currentUser() {
  let checkLogOut = document.querySelector(".user__check");
  let welcomeMessage = document.querySelector(".welcoming__message");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage) {
      // Display the toast message
      showToastUser(loginMessage, true, 2000);
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

export async function initializeUsers() {
  // Fetch users from JSON file
  try {
    const response = await fetch("users.json");
    const data = await response.json();
    const jsonUsers = data.users;

    // Retrieve existing users from local storage
    const localStorageUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if local storage is empty, then initialize it with JSON users
    if (localStorageUsers.length === 0) {
      localStorage.setItem("users", JSON.stringify(jsonUsers));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export function toggleWishlist(product) {
  let user = JSON.parse(localStorage.getItem("currentUser")) || {
    wishList: [],
  };
  // Retrieve the current user from localStorage
  // Retrieve the current user from localStorage

  if (!user) {
    showToastAdded("No user logged in.", "red");
    return;
  }

  // Log product ID for debugging
  console.log("Product ID:", product.id);

  // Find the product element
  const productElement = document.querySelector(
    `.product[data-id="${product.id}"]`
  );

  // Check if the product element exists
  if (!productElement) {
    console.error(`Product element with ID ${product.id} not found.`);
    return;
  }

  const wishlistIcon = productElement.querySelector(".add-to-wishlist");

  // Check if the wishlist icon exists
  if (!wishlistIcon) {
    console.error("Wishlist icon not found in the product element.");
    return;
  }

  // Check if the product is already in the wishlist
  const wishlistIndex = user.wishList.findIndex(
    (item) => item.id.toString() === product.id.toString()
  );

  if (wishlistIndex === -1) {
    // Product is not in wishlist, add it
    user.wishList.push(product);

    showToastAdded("Product added to wishlist!", "green");

    wishlistIcon.classList.add("wishlist-added");
  } else {
    // Product is in wishlist, remove it
    user.wishList.splice(wishlistIndex, 1);

    showToastAdded("Product removed from wishlist!", "red");

    wishlistIcon.classList.remove("wishlist-added");
  }

  // Save updated user to localStorage
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Update the users array in localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex(
    (u) => u.id.toString() === user.id.toString()
  );
  if (userIndex > -1) {
    users[userIndex] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

export function redirectToProductDetails(productId) {
  window.location.href = `productdetalis.html?id=${productId}`;
}

export function getProductDetailsById(productId) {
  let products = localStorage.getItem("products");

  if (!products) {
    console.error("No products found in local storage.");
    return null;
  }

  products = JSON.parse(products);
  return products.find((product) => product.id === productId);
}
