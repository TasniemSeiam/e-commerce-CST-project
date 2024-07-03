document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');

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
        let users = JSON.parse(localStorage.getItem("users"));
        if (!users) {
          const response = await fetch("users.json");
          const data = await response.json();
          users = data.users;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        // Check If The email is an existing one
        if (user) {
          alert(
            `Welcome, ${user.username}! You are logged in as ${user.role}.`
          );

          // Redirect upon successful Login
          if (user.role === "seller") {
            window.location.href = "seller.html";
          } else if (user.role === "admin") {
            window.location.href = "admin.html";
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
}); // end of event listener
