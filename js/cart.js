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


///////// cart items in cart list 
let cartItem = document.getElementById("cartItems");
function getCartItems() {
  let items = "";
  let cartItemsData = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartItemsData&&cartItemsData.length > 0) { 
    
    cartItemsData.forEach(item => {
      
      items += `
         <tr>
            <td class="d-none d-md-table-cell d-flex align-items-center">
              <img
                class="rounded-circle img-fluid"
                style="width: 100px; height: 100px"
                src= ${item.image[0]}
                alt=""
              />
            </td>
            <td class="fw-bold mb-1">${item.title}</td>
            <td class="fw-bold mb-1 unit-price">${item.price}</td>
            <td>
              <div class="d-flex align-items-center justify-content-center">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  onclick="decrementQuantity()"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <input
                  type="text"
                  class="form-control mx-2"
                  id="quantity"
                  value="1"
                  style="width: 45px"
                  onchange="updateTotalPrice()"
                />
                <button
                  class="btn btn-sm btn-outline-secondary"
                  onclick="incrementQuantity()"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </td>
            <td class="fw-bold mb-1 total-price">$ 130.00</td>
            <td class="">
              <button type="button" class="btn btn-sm fw-bold">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
      `
    });
    
    cartItem.innerHTML = items;
  } else {
    cartItem.innerHTML = `<tr><td colspan="6" class="text-center">Cart is empty</td></tr>`;
  }
  // return cartItem;
}
getCartItems();