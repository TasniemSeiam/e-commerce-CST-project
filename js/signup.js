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

  roleSelect.addEventListener("change", function () {
    roleSelect.value === "seller"
      ? taxContainer.classList.remove("container-hidden")
      : taxContainer.classList.add("container-hidden");
  });

  const taxError = document.querySelector(".validate__tax--error");
  const taxSuccess = document.querySelector(".validate__tax--success");

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
    const isValid = usernameInput.value.length > 3;
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
    const isValid = passwordInput.value.length > 7;
    showValidationMessage(
      passwordInput,
      passwordSuccess,
      passwordError,
      isValid,
      "",
      "Password Should be 8 characters or more."
    );
  }

  function taxValidation() {
    const isValid = /^\d{14}$/.test(taxInput.value);
    showValidationMessage(
      taxInput,
      taxSuccess,
      taxError,
      isValid,
      "",
      "Tax No. should be a 14-digit number."
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
      let response = await fetch("users.json");
      let data = await response.json();
      let users = data.users;

      const uniqueness = isUniqueUser(
        users,
        emailInput.value,
        usernameInput.value,
        taxInput.value
      );

      if (
        uniqueness.emailUnique &&
        uniqueness.usernameUnique &&
        uniqueness.taxNoUnique
      ) {
        // if (users.role === 'seller') {

        // }

        const newUser = {
          email: email,
          username: username,
          password: password,
          role: role,
          taxnumber: tax,
        };
        users.push(newUser);
        // Save The User in local storage
        localStorage.setItem("users", JSON.stringify(users));

        signInModal();

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

        if (!uniqueness.taxNoUnique) {
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
