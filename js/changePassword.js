import { toastMessage } from "./config.js";

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const emailContainer = document.getElementById("email-container");
    const otpContainer = document.getElementById("otp-container");
    const passwordContainer = document.getElementById("password-container");
    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");
    const newPasswordInput = document.getElementById("newPassword");
    const email = emailInput.value.trim(); // Trim whitespace from email
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userRequests = JSON.parse(localStorage.getItem("userRequests")) || [];
    const passwordError = document.querySelector(".validate__password--error");
    const passwordSuccess = document.querySelector(
      ".validate__password--success"
    );

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

    function passwordValidation() {
      const password = newPasswordInput.value;
      const isValid =
        password.length > 8 &&
        /[A-Z]/.test(password) && // Checks for at least one capital letter
        /[0-9]/.test(password); // Checks for at least one number
      showValidationMessage(
        newPasswordInput,
        passwordSuccess,
        passwordError,
        isValid,
        "",
        "Password must be 8+ chars, 1 uppercase, 1 number."
      );
    }

    newPasswordInput.addEventListener("blur", passwordValidation);

    const user = users.find((user) => user.email === email);

    if (user) {
      userRequests.push({
        email: email,
        requestType: "passwordChange",
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("userRequests", JSON.stringify(userRequests));
      toastMessage(
        "Password change request submitted successfully. Check your email for OTP.",
        3500
      );

      // Hide the email input form and show the OTP container
      emailContainer.style.display = "none";
      otpContainer.style.display = "block";
      document.getElementById("otp").disabled = false;
    } else {
      toastMessage("Email not found.", 3500);
    }
  });

// Verify OTP button click handler
document.getElementById("verifyOtpBtn").addEventListener("click", function () {
  const otpInput = document.getElementById("otp").value.trim();
  const storedOtp = JSON.parse(localStorage.getItem("users")) || [];
  console.log(storedOtp);

  storedOtp.forEach((otp) => {
    console.log(otp.id);

    if (+otpInput === +otp.id) {
      toastMessage(
        "OTP verified successfully. Please enter your new password.",
        3500
      );

      // Hide OTP container and show password container
      document.getElementById("otp-container").style.display = "none";
      document.getElementById("password-container").style.display = "block";
      document.getElementById("newPassword").disabled = false;
    } else {
      toastMessage("Invalid OTP. Please try again.", 3500);
    }
  });
});

// Change Password button click handler
document
  .getElementById("changePasswordBtn")
  .addEventListener("click", function () {
    const newPassword = document.getElementById("newPassword").value.trim();
    const email = document.getElementById("email").value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user by email
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex !== -1) {
      // Update the password for the user
      users[userIndex].password = newPassword;

      // Update the users array in localStorage
      localStorage.setItem("users", JSON.stringify(users));

      toastMessage("Password updated successfully.", 3500);
      // Delay redirection to login.html by 3 seconds
      setTimeout(function () {
        window.location.href = "login.html";
      }, 3000);
    } else {
      toastMessage("User not found.", 3500);
    }
  });
