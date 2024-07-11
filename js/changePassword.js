import { showToastAdded } from "./sharedHome.js";

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userRequests = JSON.parse(localStorage.getItem("userRequests")) || [];

    console.log(email);

    const user = users.find((user) => user.email === email);

    if (user) {
      userRequests.push({
        email: email,
        requestType: "passwordChange",
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("userRequests", JSON.stringify(userRequests));
      showToastAdded("Password change request submitted successfully.", 2500);
      window.location.href = "index.html";
    } else {
      showToastAdded("Email not found.", 2500);
    }
  });
