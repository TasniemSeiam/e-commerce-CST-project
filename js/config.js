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

export function isItemInWishlist(productId) {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return false;
  }
  let users = JSON.parse(localStorage.getItem("users"));
  let user = users.find((user) => user.id === +currentUser.id);
  if (!user || !Array.isArray(user.wishList)) {
    return false;
  }
  return user.wishList.some((item) => item.id === +productId);
}

export function redirectToProductDetails(productId) {
  window.location.href = `productdetalis.html?id=${productId}`;
} // End OF redirection
