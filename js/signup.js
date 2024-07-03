document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const usernameInput = document.querySelector('input[type="text"]');
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const roleSelect = document.getElementById("roleSelect");
  //
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

  // Input Validation Eventlisteners
  emailInput.addEventListener("blur", emailValidation);
  usernameInput.addEventListener("blur", userNameValidation);
  passwordInput.addEventListener("blur", passwordValidation);

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
  function isUniqueUser(users, email, userName) {
    const usernameExists = users.some((user) => user.username === userName);
    const emailExists = users.some((user) => user.email === email);
    return { emailUnique: !emailExists, usernameUnique: !usernameExists };
  }

  // Submit Listen
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!areAreaFilled()) {
      showToast("Please fill out all fields.", false);
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const uniqueness = isUniqueUser(
      users,
      emailInput.value,
      usernameInput.value
    );

    if (uniqueness.emailUnique && uniqueness.usernameUnique) {
      const newUser = {
        email: emailInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
        role: roleSelect.value,
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
    }
  }); // end of submit function
}); // end of function
