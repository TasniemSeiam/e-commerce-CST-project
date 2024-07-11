document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  handleCheckoutFormSubmission();
});

function displayCartItems() {
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
  let totalItems = cartItems.length;
  document.getElementById("quantity-of-items").textContent = totalItems;

  let cartItemsContainer = document.getElementById("cartItemsContainer");
  let items = "";

  if (cartItems.length > 0) {
    let subtotal = 0;
    cartItems.forEach((cartItem) => {
      let product = getProductDetailsById(cartItem.id);
      if (product) {
        let totalPrice = (product.price * cartItem.quantity).toFixed(2);
        subtotal += parseFloat(totalPrice);
        items += `
          <p><span class="pcs">${cartItem.quantity} pcs of</span>, <span class="text">${product.title}</span> <span class="price">$${totalPrice}</span></p>
        `;
      }
    });

    let deliveryFees = 50;
    let total = subtotal + deliveryFees;

    items += `
      <hr />
      <p class="text">Subtotal <span class="price" style="color: black"><b>$${subtotal.toFixed(
        2
      )}</b></span></p>
      <p class="text">Delivery fees <span class="price" style="color: black"><b>$${deliveryFees.toFixed(
        2
      )}</b></span></p>
      <p class="text">Total <span class="price" style="color: black"><b>$${total.toFixed(
        2
      )}</b></span></p>
    `;

    cartItemsContainer.innerHTML = items;
  } else {
    cartItemsContainer.innerHTML = `<p>Your cart is empty</p>`;
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

function handleCheckoutFormSubmission() {
  const checkoutForm = document.getElementById("checkoutForm");

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    const fname = document.getElementById("fname").value.trim();
    const fnameError = document.getElementById("fnameError");
    if (!fname || !/\S/.test(fname)) {
      fnameError.textContent = "Please enter your name";
      isValid = false;
    } else {
      fnameError.textContent = "";
    }

    const email = document.getElementById("email").value;
    const emailError = document.getElementById("emailError");
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
      emailError.textContent = "Please enter a valid email address";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    const address = document.getElementById("address").value.trim();
    const addressError = document.getElementById("addressError");
    if (!address || !/\S/.test(address)) {
      addressError.textContent = "Please enter your address";
      isValid = false;
    } else {
      addressError.textContent = "";
    }

    const city = document.getElementById("city").value.trim();
    const cityError = document.getElementById("cityError");
    if (!city || !/\S/.test(city)) {
      cityError.textContent = "Please enter your city";
      isValid = false;
    } else {
      cityError.textContent = "";
    }

    const country = document.getElementById("country").value.trim();
    const countryError = document.getElementById("countryError");
    if (!country || !/\S/.test(country)) {
      countryError.textContent = "Please enter your country";
      isValid = false;
    } else {
      countryError.textContent = "";
    }

    const pnumber = document.getElementById("pnumber").value;
    const pnumberError = document.getElementById("pnumberError");
    const pnumberPattern = /^(010|011|012|015)\d{8}$/;
    if (!pnumber.match(pnumberPattern)) {
      pnumberError.textContent = "Please enter a valid phone number";
      isValid = false;
    } else {
      pnumberError.textContent = "";
    }

    // Validate credit card information if "Credit or Debit" is selected
    const cardRadio = document.getElementById("card");
    if (cardRadio.checked) {
      const cardName = document.getElementById("cname").value.trim();
      const cardNameError = document.getElementById("cardNameError");
      const cardNamePattern = /^[a-zA-Z\s]+$/;
      if (!cardName.match(cardNamePattern)) {
        cardNameError.textContent = "Please enter a valid card name (letters and spaces only)";
        isValid = false;
      } else {
        cardNameError.textContent = "";
      }
      
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardNumberError = document.getElementById("cardNumberError");
      const cardNumberPattern = /^\d{16}$/;
      if (!cardNumber.match(cardNumberPattern)) {
        cardNumberError.textContent =
          "Please enter a valid 16-digit card number";
        isValid = false;
      } else {
        cardNumberError.textContent = "";
      }

      const expDate = document.getElementById("expDate").value.trim();
      const expDateError = document.getElementById("expDateError");
      const expDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expDate.match(expDatePattern)) {
        expDateError.textContent =
          "Please enter a valid expiration date (MM/YY)";
        isValid = false;
      } else {
        expDateError.textContent = "";
      }

      const cvv = document.getElementById("cvv").value.trim();
      const cvvError = document.getElementById("cvvError");
      const cvvPattern = /^\d{3}$/;
      if (!cvv.match(cvvPattern)) {
        cvvError.textContent = "Please enter a valid 3-digit CVV";
        isValid = false;
      } else {
        cvvError.textContent = "";
      }
    }

    if (isValid) {
      const orderData = {
        fname,
        email,
        address,
        city,
        country,
        pnumber,
      };

      placeOrder(orderData);
    }
  });
}

function placeOrder(orderData) {
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
  let cartItems = user.cart || [];
  if (cartItems.length === 0) {
    console.error("No items in cart to place an order.");
    return;
  }

  let subtotal = 0;
  let orderItems = cartItems
    .map((cartItem) => {
      let product = getProductDetailsById(cartItem.id);
      if (product) {
        let totalPrice = (product.price * cartItem.quantity).toFixed(2);
        subtotal += parseFloat(totalPrice);
        return {
          id: cartItem.id,
          name: product.title,
          quantity: cartItem.quantity,
          price: parseFloat(totalPrice),
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  let deliveryFees = 50;
  let total = subtotal + deliveryFees;

  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;

  function generateRandomId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const orderTimestamp = Date.now();
  const orderDate = new Date(orderTimestamp);

  const day = orderDate.getDate();
  const month = orderDate.getMonth() + 1;
  const year = orderDate.getFullYear();

  const formattedOrderDate = `${day}-${month}-${year}`;

  const newOrder = {
    orderId: generateRandomId(),
    orderDate: formattedOrderDate,
    orderItems: {
      ...orderItems,
    },
    total,
    orderData: {
      ...orderData,
      paymentMethod,
      trackingStatus: "Order Processed",
    },
  };

  user.orders.push(newOrder);
  user.cart = []; // Clear the cart

  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  console.log("Order placed successfully");

  window.location.href = "../myOrders.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const codRadio = document.getElementById("cod");
  const cardRadio = document.getElementById("card");
  const creditCardInfo = document.getElementById("creditCardInfo");
  const creditCardInputs = creditCardInfo.querySelectorAll("input");

  function toggleCreditCardFields(enable) {
    creditCardInputs.forEach((input) => {
      input.disabled = !enable;
    });
  }

  codRadio.addEventListener("change", function () {
    if (this.checked) {
      toggleCreditCardFields(false);
    }
  });

  cardRadio.addEventListener("change", function () {
    if (this.checked) {
      toggleCreditCardFields(true);
    }
  });

  // Initialize the form with COD as the default
  toggleCreditCardFields(false);
});
