import { showToastUser } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  let users = JSON.parse(localStorage.getItem("users"));

  const logoutMessage = localStorage.getItem("logoutMessage");
  if (logoutMessage) {
    // Display the toast message
    showToastUser(logoutMessage, true, 4000);
    // Clear the logout message from localStorage
    localStorage.removeItem("logoutMessage");
  }

  // TOAST Functionality
  function showToast(message, success = true) {
    const toast = document.getElementById("toast");
    const toastBody = toast.querySelector(".toast-body");
    toastBody.textContent = message;
    toast.classList.remove("bg-primary", "bg-danger");
    toast.classList.add(success ? "bg-primary" : "bg-danger");
    toast.classList.remove("d-none");
    toast.classList.add("d-block");
    toast.classList.add("show");

    setTimeout(function () {
      toast.classList.remove("show");
      toast.classList.remove("d-block");
      toast.classList.add("d-none");
    }, 1500);
  }

  function areAreaFilled() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    return email !== "" && password !== "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (!areAreaFilled()) {
        showToast("Please fill out all fields.", false);
      } else {
        // Fetching data from Json File

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        // Check If The email is an existing one
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem(
            "loginMessage",
            "Welcome! You have successfully logged in."
          );

          // Redirect upon successful Login
          if (user.role === "seller") {
            window.location.href = "sellerPanel.html";
          } else if (user.role === "admin") {
            window.location.href = "adminPanel.html";
          } else {
            window.location.href = "index.html";
          }
        } else {
          showToast("Invalid email or password. Please try again.", false);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      window.location.href = "page404.html";
    }
  }); // end of submit

  // // Check if a user is logged in on page load
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // if (currentUser) {
  //   alert(
  //     `Welcome back, ${currentUser.username}! You are logged in as ${currentUser.role}.`
  //   );
  //   if (currentUser.role === "seller") {
  //     window.location.href = "sellerPanel.html";
  //   } else if (currentUser.role === "admin") {
  //     window.location.href = "adminPanel.html";
  //   } else {
  //     window.location.href = "index.html";
  //   }
  // }
}); // end of event listener
