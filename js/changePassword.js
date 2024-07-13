import { toastMessage, initializeUsers } from "./config.js";

// Load users on Page lOAD
document.addEventListener("DOMContentLoaded", initializeUsers);

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("hello");

    const emailContainer = document.getElementById("email-container");
    const otpContainer = document.getElementById("otp-container");
    const passwordContainer = document.getElementById("password-container");
    const securityQuestionContainer = document.getElementById(
      "security-question-container"
    );
    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");
    const newPasswordInput = document.getElementById("newPassword");
    const securityAnswerInput = document.getElementById("security-answer");
    const email = emailInput.value.trim().toLowerCase(); // Trim whitespace from email
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
      if (user.role === "admin") {
        toastMessage("Email not found.", 3500);
      } else {
        // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        userRequests.push({
          email: email,
          requestType: "passwordChange",
          otp: "", // OTP initially empty
          id: Date.now().toString(),
        });
        localStorage.setItem("userRequests", JSON.stringify(userRequests));
        toastMessage(
          "Password change request submitted successfully. Wait for OTP.",
          3500
        );

        // Hide the email input form and show the OTP container
        emailContainer.style.display = "none";
        otpContainer.style.display = "block";
        document.getElementById("otp").disabled = false;
      }
    } else {
      toastMessage("Email not found.", 3500);
    }
  });

// Function to display the OTP if available
function checkForOtp() {
  const userRequests = JSON.parse(localStorage.getItem("userRequests")) || [];
  const email = document.getElementById("email").value.trim();
  const request = userRequests.find((req) => req.email === email);

  if (request && request.otp) {
    document.getElementById("otp-response").innerText = request.otp;
  } else {
    document.getElementById("otp-response").innerText = "Waiting for OTP...";
  }
}

// Check for OTP every 5 seconds
setInterval(checkForOtp, 5000);

// Initial check
checkForOtp();

// Verify Security Question button click handler
document
  .getElementById("verifySecurityQuestionBtn")
  .addEventListener("click", function () {
    const securityAnswer = document
      .getElementById("security-answer")
      .value.trim();
    const email = document.getElementById("email").value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (user) => user.email === email && user.securityAnswer === securityAnswer
    );

    if (user) {
      toastMessage(
        "Security question answered successfully. Please enter your new password.",
        3500
      );

      // Hide security question container and show password container
      document.getElementById("security-question-container").style.display =
        "none";
      document.getElementById("password-container").style.display = "block";
      document.getElementById("newPassword").disabled = false;
    } else {
      toastMessage("Invalid answer. Please try again.", 3500);
    }
  });

// Verify OTP button click handler
document.getElementById("verifyOtpBtn").addEventListener("click", function () {
  const otpInput = document.getElementById("otp").value.trim();
  const email = document.getElementById("email").value.trim();
  const userRequests = JSON.parse(localStorage.getItem("userRequests")) || [];

  if (!otpInput) {
    toastMessage("Please enter the OTP.", 3500);
    return;
  }

  // Check For The Right OTP Request
  const request = userRequests.find(
    (req) => req.email === email && +req.otp === +otpInput
  );

  if (request) {
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

// Change Password button click handler
document
  .getElementById("changePasswordBtn")
  .addEventListener("click", function () {
    const newPassword = document.getElementById("newPassword").value.trim();
    const email = document.getElementById("email").value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!newPassword) {
      toastMessage("Please enter the a new password.", 3500);
      return;
    }

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
