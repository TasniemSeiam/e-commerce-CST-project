export function showToastUser(message, success = true, timeout = 3000) {
  // Create a new toast element
  const toastElement = document.createElement("div");
  toastElement.classList.add("toast");
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");

  // Set toast header
  const toastHeader = document.createElement("div");
  toastHeader.classList.add("toast-header");

  // Optional: You can add an icon or image to the toast header
  // const toastIcon = document.createElement("img");
  // toastIcon.src = "your-icon-path";
  // toastIcon.classList.add("rounded", "me-2");
  // toastIcon.setAttribute("alt", "...");

  const toastTitle = document.createElement("strong");
  toastTitle.classList.add("me-auto");
  toastTitle.textContent = "Notification"; // Set your own title

  const toastTime = document.createElement("small");
  toastTime.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  toastHeader.appendChild(toastTitle);
  toastHeader.appendChild(toastTime);

  // Set toast body
  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.textContent = message;

  // Set toast class based on success or error
  if (success) {
    toastElement.classList.add("bg-success", "text-white");
  } else {
    toastElement.classList.add("bg-danger", "text-white");
  }

  toastElement.appendChild(toastHeader);
  toastElement.appendChild(toastBody);

  // Add toast to toast container
  const toastContainer = document.getElementById("toastPlacement");
  toastContainer.innerHTML = ""; // Clear previous toasts if any
  toastContainer.appendChild(toastElement);

  // Initialize Bootstrap Toast and show it
  const bootstrapToast = new bootstrap.Toast(toastElement);
  bootstrapToast.show();

  // Hide toast after timeout
  setTimeout(function () {
    bootstrapToast.hide();
  }, timeout);
}
