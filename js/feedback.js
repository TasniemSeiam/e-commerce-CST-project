import { currentUser, showToastUser } from "./config.js";
import { showToastAdded } from "./sharedHome.js";

document.addEventListener("DOMContentLoaded", function () {
  currentUser();
  const feedbackTypeSelect = document.getElementById("feedbackType");
  const generalFeedbackContainer = document.getElementById(
    "generalFeedbackContainer"
  );
  const productFeedbackContainer = document.getElementById(
    "productFeedbackContainer"
  );

  feedbackTypeSelect.addEventListener("change", function () {
    if (this.value === "general") {
      generalFeedbackContainer.style.display = "block";
      productFeedbackContainer.style.display = "none";
    } else if (this.value === "product") {
      generalFeedbackContainer.style.display = "none";
      productFeedbackContainer.style.display = "block";
    } else {
      generalFeedbackContainer.style.display = "none";
      productFeedbackContainer.style.display = "none";
    }
  });

  // Form validation
  (function () {
    "use strict";
    window.addEventListener(
      "load",
      function () {
        var forms = document.getElementsByClassName("needs-validation");
        Array.prototype.filter.call(forms, function (form) {
          form.addEventListener(
            "submit",
            function (event) {
              if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
              } else {
                event.preventDefault();
                handleFormSubmit();
              }
              form.classList.add("was-validated");
            },
            false
          );
        });
      },
      false
    );
  })();

  function handleFormSubmit() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const feedbackType = document.getElementById("feedbackType").value;
    const feedback =
      feedbackType === "general"
        ? document.getElementById("generalFeedback").value
        : {
            productName: document.getElementById("productName").value,
            purchaseDate: document.getElementById("purchaseDate").value,
            productFeedback: document.getElementById("productFeedback").value,
          };

    const feedbackData = {
      name,
      email,
      feedbackType,
      feedback,
    };

    saveFeedback(feedbackData);
  }

  function saveFeedback(feedbackData) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users"));

    if (currentUser && users) {
      const updatedUsers = users.map((user) => {
        if (user.email === currentUser.email) {
          user.feedback = user.feedback || [];
          user.feedback.push(feedbackData);
          localStorage.setItem("currentUser", JSON.stringify(user));
          return user;
        }
        return user;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      showToastAdded("Feedback submitted successfully!", 2000);
    } else {
      showToastAdded(
        "User data not found. Please ensure you are logged in.",
        2000
      );
    }
  }
});
