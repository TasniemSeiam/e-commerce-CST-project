const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let isValid = true;

  const fname = document.getElementById("fname").value;
  const fnameError = document.getElementById("fnameError");
  if (!fname) {
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

  const address = document.getElementById("address").value;
  const addressError = document.getElementById("addressError");
  if (!address) {
    addressError.textContent = "Please enter your address";
    isValid = false;
  } else {
    addressError.textContent = "";
  }

  const city = document.getElementById("city").value;
  const cityError = document.getElementById("cityError");
  if (!city) {
    cityError.textContent = "Please enter your city";
    isValid = false;
  } else {
    cityError.textContent = "";
  }

  const country = document.getElementById("country").value;
  const countryError = document.getElementById("countryError");
  if (!country) {
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

  if (isValid) {
    document.getElementById("checkoutForm").submit();
    window.location.href = "../myOrders.html";

    const orderData = {
      fname,
      email,
      address,
      city,
      country,
      pnumber,
    };

    // save data in local storage
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }
});
