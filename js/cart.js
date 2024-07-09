let cartItem = document.getElementById("cartItems");
let cartTotals = document.querySelector(".cart-totals");

function getCartItems() {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);
  const user = users.find((user) => user.id === currentUser.id);

  if (!user) {
    console.error("Current user not found in users.");
    return;
  }

  let cartItems = user.cart || [];

  let items = "";
  if (cartItems.length > 0) {
    cartItems.forEach((cartItem) => {
      let product = getProductDetailsById(cartItem.id);
      if (product) {
        items += `
          <tr>
            <td class="d-none d-md-table-cell d-flex align-items-center">
              <img
                class="rounded-circle img-fluid"
                style="width: 80px; height: 80px"
                src=${product.image[0]}
                alt=""
              />
            </td>
            <td class="fw-bold mb-1">${product.title}</td>
            <td class="fw-bold mb-1 unit-price">$${product.price.toFixed(
              2
            )}</td>
            <td>
              <div class="d-flex align-items-center justify-content-center">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  onclick="decrementQuantity(${cartItem.id})"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <input
                  type="number"
                  class="form-control mx-2 quantity"
                  id="quantity-${cartItem.id}"
                  value="${cartItem.quantity}"
                  style="width: 50px"
                  onchange="updateTotalPrice(${cartItem.id})"
                />
                <button
                  class="btn btn-sm btn-outline-secondary"
                  onclick="incrementQuantity(${cartItem.id})"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </td>
            <td class="fw-bold mb-1 total-price">$${(
              product.price * cartItem.quantity
            ).toFixed(2)}</td>
            <td class="">
              <button type="button" class="btn btn-sm fw-bold remove-item" onclick="removeFromCart(${
                cartItem.id
              })">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }
    });
    cartItem.querySelector("tbody").innerHTML = items;
    cartTotals.style.display = "block";
  } else {
    cartItem.querySelector(
      "tbody"
    ).innerHTML = `<tr><td colspan="6" class="text-center">Cart is empty</td></tr>`;
    cartTotals.style.display = "none";
  }
  updateCartTotals();
}

document.addEventListener("DOMContentLoaded", (event) => {
  getCartItems();
});

function incrementQuantity(productId) {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    return;
  }

  let user = users[userIndex];

  let cartItem = user.cart.find((item) => item.id === productId);
  if (!cartItem) {
    console.error("Product not found in user's cart.");
    return;
  }

  // Increment quantity
  cartItem.quantity++;

  // Update local storage
  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById(`quantity-${productId}`).value = cartItem.quantity;
  updateTotalPrice(productId);
}

function decrementQuantity(productId) {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    return;
  }

  let user = users[userIndex];

  let cartItem = user.cart.find((item) => item.id === productId);
  if (!cartItem) {
    console.error("Product not found in user's cart.");
    return;
  }

  // Decrement quantity
  if (cartItem.quantity > 1) {
    cartItem.quantity--;

    // Update local storage
    users[userIndex] = user;
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById(`quantity-${productId}`).value = cartItem.quantity;
    updateTotalPrice(productId);
  }
}

function updateTotalPrice(productId) {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    return;
  }

  let user = users[userIndex];

  let cartItem = user.cart.find((item) => item.id === productId);
  if (!cartItem) {
    console.error("Product not found in user's cart.");
    return;
  }

  cartItem.quantity = parseInt(
    document.getElementById(`quantity-${productId}`).value
  );

  let unitPriceElement = document
    .querySelector(`#quantity-${productId}`)
    .closest("tr")
    .querySelector(".unit-price");
  let totalPriceElement = document
    .querySelector(`#quantity-${productId}`)
    .closest("tr")
    .querySelector(".total-price");

  let unitPrice = parseFloat(unitPriceElement.textContent.replace("$", ""));
  let totalPrice = cartItem.quantity * unitPrice;

  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  updateCartTotals();
}

function updateCartTotals() {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    return;
  }

  let user = users[userIndex];

  let subtotal = 0;
  user.cart.forEach((cartItem) => {
    let product = getProductDetailsById(cartItem.id);
    if (product) {
      subtotal += cartItem.quantity * product.price;
    }
  });

  let deliveryFees = 50;
  let total = subtotal + deliveryFees;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById(
    "delivery-fees"
  ).textContent = `$${deliveryFees.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;

  if (user.cart.length > 0) {
    cartTotals.style.display = "block";
  } else {
    cartTotals.style.display = "none";
  }
}

function getProductDetailsById(productId) {
  let products = localStorage.getItem("products");

  if (!products) {
    console.error("No products found in local storage.");
    return null;
  }

  products = JSON.parse(products);
  return products.find((product) => product.id === productId);
}

function removeFromCart(productId) {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    return;
  }

  let user = users[userIndex];

  user.cart = user.cart.filter((item) => item.id !== productId);

  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  console.log("Product removed from cart successfully");

  getCartItems();
}
