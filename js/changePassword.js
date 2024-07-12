import { showToastUser } from "./config.js";

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
        id: Date.now().toString(),
      });
      localStorage.setItem("userRequests", JSON.stringify(userRequests));
      showToastUser("Password change request submitted successfully.", 2500);
      window.location.href = "index.html";
    } else {
      showToastUser("Email not found.", 2500);
    }
  });
