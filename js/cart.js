function updateTotalPrice() {
  let quantityInput = document.getElementById("quantity");
  let unitPriceElement = document.querySelector(".unit-price");
  let totalPriceElement = document.querySelector(".total-price");

  let quantity = parseInt(quantityInput.value);
  let unitPrice = parseFloat(unitPriceElement.textContent.replace("$", ""));
  let totalPrice = quantity * unitPrice;

  totalPriceElement.textContent = "$" + totalPrice.toFixed(2);
}

function decrementQuantity() {
  let quantityInput = document.getElementById("quantity");
  let quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
    quantityInput.value = quantity - 1;
    updateTotalPrice();
  }
}

function incrementQuantity() {
  let quantityInput = document.getElementById("quantity");
  let quantity = parseInt(quantityInput.value);
  quantityInput.value = quantity + 1;
  updateTotalPrice();
}
