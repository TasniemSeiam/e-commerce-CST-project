import { initializeUsers } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const usernameInput = document.querySelector('input[type="text"]');
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const taxInput = document.querySelector(".tax__input");
  const roleSelect = document.getElementById("roleSelect");
  const taxContainer = document.querySelector(".container-tax ");
  const emailSuccess = document.querySelector(".validate__email--success");
  const emailError = document.querySelector(".validate__email--error");
  const userNameError = document.querySelector(".validate__userName--error");
  const userNameSuccess = document.querySelector(
    ".validate__userName--success"
  );
  const passwordError = document.querySelector(".validate__password--error");
  const passwordSuccess = document.querySelector(
    ".validate__password--success"
  );
  const taxError = document.querySelector(".validate__tax--error");
  const taxSuccess = document.querySelector(".validate__tax--success");

  roleSelect.addEventListener("change", function () {
    roleSelect.value === "seller"
      ? taxContainer.classList.remove("container-hidden")
      : taxContainer.classList.add("container-hidden");
  });

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

  function signInModal() {
    // Show modal after delay
    $("#successModal").modal("show");

    // Close modal and redirect after 1 second
    setTimeout(function () {
      $("#successModal").modal("hide");
      window.location.href = "login.html";
    }, 3000);
  }

  function showValidationMessage(
    input,
    successElement,
    errorElement,
    isValid,
    successMessage,
    errorMessage
  ) {
    if (isValid) {
      input.classList.add("success");
      input.classList.remove("error");
      successElement.style.display = "block";
      successElement.innerHTML = successMessage;
      errorElement.style.display = "none";
    } else {
      input.classList.add("error");
      input.classList.remove("success");
      successElement.style.display = "none";
      errorElement.style.display = "block";
      errorElement.innerHTML = errorMessage;
    }
  }

  // Input Validation Handlers
  function emailValidation() {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    showValidationMessage(
      emailInput,
      emailSuccess,
      emailError,
      isValid,
      "Looks Good.",
      "Invalid email format."
    );
  }

  function userNameValidation() {
    const isValid = usernameInput.value.length > 3 && usernameInput !== "";
    showValidationMessage(
      usernameInput,
      userNameSuccess,
      userNameError,
      isValid,
      "Looks Good.",
      "Username Should be at least 4 characters."
    );
  }

  function passwordValidation() {
    const password = passwordInput.value;
    const isValid =
      password.length > 8 &&
      /[A-Z]/.test(password) && // Checks for at least one capital letter
      /[0-9]/.test(password); // Checks for at least one number
    showValidationMessage(
      passwordInput,
      passwordSuccess,
      passwordError,
      isValid,
      "",
      "Password must be 8+ chars, 1 uppercase, 1 number."
    );
  }

  function taxValidation() {
    const isValid =
      roleSelect.value === "seller" ? /^\d{14}$/.test(taxInput.value) : true;
    showValidationMessage(
      taxInput,
      taxSuccess,
      taxError,
      isValid,
      "",
      "Invalid Tax Number"
    );
  }

  // Input Validation Eventlisteners
  emailInput.addEventListener("blur", emailValidation);
  usernameInput.addEventListener("blur", userNameValidation);
  passwordInput.addEventListener("blur", passwordValidation);
  taxInput.addEventListener("blur", taxValidation);

  // Checker For Filled Areas
  function areAreaFilled() {
    return (
      emailInput.value &&
      usernameInput.value &&
      passwordInput.value &&
      roleSelect.value
    );
  }

  // Checker For Unique User
  function isUniqueUser(users, email, userName, taxNo) {
    const usernameExists = users.some((user) => user.username === userName);
    const emailExists = users.some((user) => user.email === email);
    const taxNumberExists = users.some((user) => user.taxnumber === taxNo);
    return {
      emailUnique: !emailExists,
      usernameUnique: !usernameExists,
      taxNoUnique: !taxNumberExists,
    };
  }

  // Initialize users when the page loads
  initializeUsers();

  // Submit Listener
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!areAreaFilled()) {
      showToast("Please fill out all fields.", false);
      return;
    }

    // Trim and lowercase input values
    const email = emailInput.value.trim().toLowerCase();
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    const role = roleSelect.value.trim().toLowerCase();
    const tax = taxInput.value.trim();

    try {
      // Retrieve existing users from local storage
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Check for uniqueness
      const uniqueness = isUniqueUser(users, email, username, tax);

      if (
        uniqueness.emailUnique &&
        uniqueness.usernameUnique &&
        (uniqueness.taxNoUnique || role !== "seller")
      ) {
        const newUser = {
          id: new Date().getUTCMilliseconds(),
          email: email,
          username: username,
          password: password,
          role: role,
          taxnumber: role === "seller" ? tax : "",
          wishList: [],
          orders: [],
          cart: [],
          pendingProducts: [],
          feedback: [],
          feedbackResponse: [],
          comments: [],
          securityQuestion: "",
          securityAnswer: "",
        };
        users.push(newUser);

        // Save the updated user list in local storage
        localStorage.setItem("users", JSON.stringify(users));

        signInModal();

        // Reset form after successful submission
        form.reset();

        // Clear validation messages
        emailSuccess.style.display = "none";
        emailError.style.display = "none";
        userNameSuccess.style.display = "none";
        userNameError.style.display = "none";
        passwordSuccess.style.display = "none";
        passwordError.style.display = "none";
        taxSuccess.style.display = "none";
        taxError.style.display = "none";

        // Redirect or perform other actions upon successful sign-up
      } else {
        if (!uniqueness.emailUnique) {
          showValidationMessage(
            emailInput,
            emailSuccess,
            emailError,
            false,
            "",
            "Email is already in use."
          );
        }

        if (!uniqueness.usernameUnique) {
          showValidationMessage(
            usernameInput,
            userNameSuccess,
            userNameError,
            false,
            "",
            "Username is already in use."
          );
        }
        // only validation for seller
        if (role === "seller" && !uniqueness.taxNoUnique) {
          showValidationMessage(
            taxInput,
            taxSuccess,
            taxError,
            false,
            "",
            "Tax Number is already in use."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("An error occurred. Please try again later.", false);
    }
  }); // end of submit function
}); // end of function

let notLogIn = document.querySelectorAll("footer .preventIfLogOut");

notLogIn.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    let currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      e.preventDefault();
      window.location.href = "./login.html";
      return;
    }
  });
});
