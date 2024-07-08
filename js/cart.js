document.addEventListener("DOMContentLoaded", () => {
  updateCartTotals();

  document.querySelectorAll(".increment-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      let quantityInput = button.parentElement.querySelector(".quantity");
      let quantity = parseInt(quantityInput.value);
      quantityInput.value = quantity + 1;
      updateTotalPrice(quantityInput);
    });
  });

  document.querySelectorAll(".decrement-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      let quantityInput = button.parentElement.querySelector(".quantity");
      let quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
        updateTotalPrice(quantityInput);
      }
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("tr").remove();
      updateCartTotals();
    });
  });
});

function updateTotalPrice(input) {
  let unitPriceElement = input.closest("tr").querySelector(".unit-price");
  let totalPriceElement = input.closest("tr").querySelector(".total-price");

  let quantity = parseInt(input.value);
  let unitPrice = parseFloat(unitPriceElement.textContent.replace("$", ""));
  let totalPrice = quantity * unitPrice;

  totalPriceElement.textContent = "$" + totalPrice.toFixed(2);
  updateCartTotals();
}

function updateCartTotals() {
  let subtotal = 0;
  document.querySelectorAll(".total-price").forEach((totalPriceElement) => {
    subtotal += parseFloat(totalPriceElement.textContent.replace("$", ""));
  });
  let deliveryFees = 50;
  let total = subtotal + deliveryFees;

  document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
  document.getElementById("delivery-fees").textContent =
    "$" + deliveryFees.toFixed(2);
  document.getElementById("total").textContent = "$" + total.toFixed(2);
}
