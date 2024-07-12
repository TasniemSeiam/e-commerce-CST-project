
// currentUser();

let currentUsers = JSON.parse(localStorage.getItem("currentUser")) || [];

let getProduct = JSON.parse(localStorage.getItem("products")) || [];

export function displayProduct(product, _location) {
  // product.forEach((product) => {
  let productDiv = document.createElement("div");
  productDiv.className = "col-12 col-sm-6 col-md-3 col-lg  px-2 mb-2";
  let productCard = document.createElement("div");
  productCard.className = "card text-center cardProducts";
  productCard.style.cursor = "pointer";
  productCard.setAttribute("id", `pro${product.id}`);
  productCard.setAttribute("data-id", `${product.id}`);
  let divHeart = document.createElement("div");
  divHeart.className = "position-relative divheart";
  let imgsDiv = document.createElement("div");
  imgsDiv.className = "imgsDiv position-relative p-1";
  let imgs = document.createElement("img");
  imgs.className = " imgs  mx-auto card-img-top";
  imgs.src = product.image[0];
  imgs.alt = product.title;
  let imgs2 = document.createElement("img");
  imgs2.className = " imgs2  mx-auto card-img-top ";
  imgs2.src = product.image[1];
  imgs2.alt = product.title;
  let wishlistBtn = document.createElement("span");
  wishlistBtn.title = "add to wishlist";
  wishlistBtn.className =
    "mx-auto mx-md-0  wishlistHeart btn-white  rounded-circle fas fa-heart wishlistHearti";

  wishlistBtn.setAttribute("data-product-id", product.id);
  updateWishlistButtonStates();

  // Redirect To Product Detalis Functionality For Best Selling Products and Top Flash Deals
  document.querySelectorAll(".cardProducts").forEach((product) =>
    product.addEventListener("click", function (e) {
      e.preventDefault();
      const productItemId = product.getAttribute("data-id");

      redirectToProductDetails(+productItemId);
    })
  );
  function redirectToProductDetails(productId) {
    window.location.href = `productdetalis.html?id=${productId}`;
  }
  // // let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // if (currentUsers) {
  //   console.log("loged in as current user");
  // }
  // let wish = currentUsers.wishList || [];

  // // Get all wishlist buttons
  // const wishlistButtons = document.querySelectorAll("[data-product-id]");

  // // Loop through each button and update its state
  // wishlistButtons.forEach((btn) => {
  //   const productId = btn.dataset.productId;
  //   const product = getProduct.find(
  //     (product) => product.id === Number(productId)
  //   );

  //   if (wish.find((s) => s.id === product.id)) {
  //     btn.classList.add("addedtowishlist");
  //   } else {
  //     btn.classList.remove("addedtowishlist");
  //   }
  // });

  // const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
  // let btnStateObj = {};

  // if (wishlistBtnState) {
  //   btnStateObj = JSON.parse(wishlistBtnState);
  // }
  // if (wishlistBtnState.indexOf(product.id) !== -1) {
  //   if (btnStateObj[product.id]) {
  //     wishlistBtn.classList.add = "addedtowishlist ";

  //     // addTofavBtn.className = "addtofav addedtowishlist "
  //   } else {
  //     // addTofavBtn.className = "addtofav"
  //     wishlistBtn.classList.remove = "addedtowishlist";
  //   }
  // }

  // wishListBtnStates(wishlistBtn, product);

  imgsDiv.appendChild(imgs);
  imgsDiv.appendChild(imgs2);
  divHeart.appendChild(imgsDiv);
  divHeart.appendChild(wishlistBtn);
  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  let cardTitle = document.createElement("p");
  cardTitle.className = "card-title text-primary";
  cardTitle.textContent = product.title;
  let cardRate = document.createElement("ul");
  cardRate.className = "list-inline mb-1";
  for (let s = 0; s < 5; s++) {
    let li = document.createElement("li");
    li.className = "list-inline-item mr-1 ";
    let star = document.createElement("i");
    star.className = "fa-regular fa-star";
    // star.style.color = s < Math.floor(product.rating.rate) ? "gold" : "gray";
    if (s < Math.round(product.rating.rate)) {
      star.style.color = "gold";
      star.removeClassName = "fa-regular";
      star.classList.add("fa-solid");
    } else {
      star.style.color = "gray";
      star.removeClassName = "fa-solid";
      star.classList.add("fa-regular");
    }
    li.appendChild(star);
    cardRate.appendChild(li);
  }
  let cardprice = document.createElement("h6");
  cardprice.textContent = "price: " + product.price + "$";
  let cartBtndiv = document.createElement("div");
  cartBtndiv.className = "cartBtndiv pt-2 pt-sm-0";
  let cartBtn = document.createElement("button");
  cartBtn.textContent = "Add to Cart";
  cartBtn.className =
    "btn mx-auto mx-md-0 text-center btn-warning addToCart  rounded-pill";
  // wishListBtnStates(wishlistBtn, product, currentUsers.id);

  cartBtn.addEventListener("click", function (e) {
    let currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      e.preventDefault();
      window.location.href = "./login.html";
      return;
    } else {
      addToCart(product.id);
    }
  });
  wishlistBtn.addEventListener("click", function (e) {
    // wishListBtnStates(e.target, product);
    let currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      e.preventDefault();
      window.location.href = "./login.html";
      return;
    } else {
      addToWishlist(product.id, e.target);
      console.log("Wishlist", currentUsers.wishList);
    }
  });

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardRate);
  cardBody.appendChild(cardprice);
  cartBtndiv.appendChild(cartBtn);
  cardBody.appendChild(cartBtndiv);
  productCard.appendChild(divHeart);
  productCard.appendChild(cardBody);
  productDiv.appendChild(productCard);
  _location.appendChild(productDiv);
  // });
}
let categoriesarr = [];

export function getCategories(getProduct) {
  let keys = Object.keys(getProduct);
  keys.forEach((key) => {
    console.log(getProduct[key].category); //categories
    if (categoriesarr.includes(getProduct[key].category)) {
      console.log(getProduct[key].category); //products
    } else {
      categoriesarr.push(getProduct[key].category);
    }
  });
  console.log(categoriesarr);
  return categoriesarr;
}

////// add to cart list

// let addToCartList = [];

// export function addToCart(productId) {
//   // let cartdata =  JSON.parse(localStorage.getItem("cart"));
//   // console.log('Cart data', cartdata.length);
//   if (cartdata && cartdata.length > 0) {
//     cartListUpdated(cartdata, productId);
//   } else {
//     cartListUpdated(addToCartList, productId);
//   }
// }
// export function cartListUpdated(_cartdata, _productId) {
//   let product = getProduct.find((product) => product.id === _productId);
//   if (_cartdata.some((item) => item.id === _productId)) {
//     // alert("This product has already been added to the cart.");
//   } else {
//     if (product.rating.count > 0) {
//       _cartdata.push(product);
//       cartCount.textContent = _cartdata.length;
//       alert(`Product "${product.title}" has been added to the cart.`);
//       // displayCartList();
//       localStorage.setItem("cart", JSON.stringify(_cartdata));
//       console.log("Cart", _cartdata);
//     } else {
//       alert("This product: " + product.title + " is out of stock.");
//     }
//   }
// }
// let cartdata = JSON.parse(localStorage.getItem("cart")) || [];

let cartCount = document.getElementById("cartCount");
// let cartdata = currentUsers.cart;

// cartCount.textContent = cartdata ? cartdata.length : 0;

export function addToCart(productId) {
  let users = localStorage.getItem("users");
  let products = localStorage.getItem("products");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("You need to login first to add to your cart.");
    showToastAdded(
      "You need to login first to add to your cart.",
      "text-bg-danger"
    );
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    showToastAdded("No users found in local storage.", "text-bg-danger");
    return;
  }

  if (!products) {
    console.error("No products found in local storage.");
    showToastAdded("No products found in local storage.", "text-bg-danger");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);
  products = JSON.parse(products);

  // Find the logged in user in the users array
  const userIndex = users.findIndex((user) => +user.id === +currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    showToastAdded("Current user not found in users.", "text-bg-danger");

    return;
  }

  let user = users[userIndex];

  if (!Array.isArray(user.cart)) {
    console.error("Invalid cart structure in currentUser.");
    showToastAdded("Invalid cart structure in currentUser.", "text-bg-danger");

    return;
  }

  const productAlreadyInCart = user.cart.some(
    (item) => +item.id === +productId
  );
  if (productAlreadyInCart) {
    console.error("Product already in cart.");
    showToastAdded("Product already in cart.", "text-bg-warning");
    return;
  }

  const product = products.find((p) => +p.id === +productId);
  if (!product) {
    console.error("Product not found.");
    return;
  }

  user.cart.push({ id: productId, price: product.price, quantity: 1 });

  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));
  let cartNum = user.cart.length;
  cartCount.textContent = user.cart ? cartNum : 0;

  console.log("Product added to cart successfully");
  showToastAdded("Product added to cart successfully.", "text-bg-success");
  console.log(user.cart.length);
  // Refresh the cart items
  // getCartItems();
}

let currentuser =localStorage.getItem("currentUser");
let users =localStorage.getItem("users");

if (!currentuser) {
  console.error("You need to login first to add to your cart.");
  // showToastAdded(
    // "You need to login first to add to your cart.",
    // "text-bg-danger"
  // );
  // return;
}

if (!users) {
  console.error("No users found in local storage.");
  // showToastAdded("No users found in local storage.", "text-bg-danger");
  // return;
}

currentuser = JSON.parse(currentuser);
users = JSON.parse(users);
// Find the logged in user in the users array
const userIndex = users.findIndex((user) => user.id === currentuser.id);
if (userIndex === -1) {
  console.log("Current user not found in users.");
}
let user = users[userIndex];
let cartNum = user.cart.length;
cartCount.textContent = user.cart ? cartNum : 0;
// add to wishlist
export async function addToWishlist(productId, btn) {
  let currentUser = localStorage.getItem("currentUser");
  let users = localStorage.getItem("users");
  let products = localStorage.getItem("products");

  if (!currentUser) {
    console.error("You need to login first to add to your wishlist.");
    showToastAdded(
      "You need to login first to add to your wishlist.",
      "text-bg-danger"
    );
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    showToastAdded("No users found in local storage.", "text-bg-danger");
    return;
  }

  if (!products) {
    console.error("No products found in local storage.");
    showToastAdded("No products found in local storage.", "text-bg-danger");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);
  products = JSON.parse(products);

  // Find the logged-in user in the users array
  const userIndex = users.findIndex((user) => +user.id === +currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    showToastAdded("Current user not found in users.", "text-bg-danger");
    return;
  }

  let user = users[userIndex];

  if (!Array.isArray(user.wishList)) {
    console.error("Invalid wishlist structure in currentUser.");
    showToastAdded(
      "Invalid wishlist structure in currentUser.",
      "text-bg-danger"
    );
    return;
  }

  const productAlreadyInWishlist = user.wishList.some(
    (item) => item.id === +productId
  );
  if (productAlreadyInWishlist) {
    // Remove product from wishlist
    user.wishList = user.wishList.filter((item) => +item.id !== +productId);
    btn.classList.remove("addedtowishlist");
    showToastAdded(
      "Product has been deleted from your wishlist.",
      "text-bg-danger"
    );
  } else {
    const product = products.find((p) => +p.id === +productId);
    if (!product) {
      console.error("Product not found.");

      return;
    }

    // Add product to wishlist
    user.wishList.push(product);
    btn.classList.add("addedtowishlist");
    showToastAdded(
      "Product has been added to your wishlist.",
      "text-bg-success"
    );
  }

  // Update user in the users array
  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  // Update currentUser in localStorage if it matches the updated user
  if (+currentUser.id === +user.id) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
}

// add to wishlist  list

// let wishList = [];
// let wishlistdata = JSON.parse(localStorage.getItem("wishlist")) || [];
// let wishlistdata =currentUser.wishList;
// let wishlistdata =[...currentUsers.wishList];
// async function addToWishlist(productId, btn) {
//   let wishlistdata = await JSON.parse(localStorage.getItem("currentUser")) || [];
//   // wishlistdata =currentUsers.wishList ;
//   wishlistdata = wishlistdata.wishList;
//   if (wishlistdata && wishlistdata.length > 0) {
//     wishListUpdated(wishlistdata, productId, btn);
//   } else {
//     // wishListUpdated(wishList, productId, btn);
//     wishListUpdated(wishlistdata, productId, btn);
//   }
// }

// async function wishListUpdated(_wishList, _productId) {
//   let product = await getProduct.find((product) => product.id === _productId);
//   // if (_wishList.includes(_productId))  {
//   if (_wishList.some((item) => item.id === _productId)) {
//     let updatedWishlist = _wishList.filter((item) => item.id !== _productId);
//     // localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
//     wishlistdata = updatedWishlist;
//     localStorage.setItem("currentUser", JSON.stringify(wishlistdata));

//     // btn.classList.remove("addedtowishlist");
//     alert("This product has been deleted from your wishlist");
//   } else {
//     // if ((product.rating.count) > 0) {}
//     // btn.classList.add("addedtowishlist")
//     _wishList.push(product);
//     alert(`Product "${product.title}" has been added to your wishlist.`);
//     // displayWishlistList();
//     // localStorage.setItem("wishlist", JSON.stringify(_wishList));
//     localStorage.setItem("currentUser", JSON.stringify(_wishList));
//     console.log("Wishlist", _wishList);
//   }
// }

// export async function addToWishlist(productId, btn) {
//   const currentUser =
//     (await JSON.parse(localStorage.getItem("currentUser"))) || {};
//   const wishlist = currentUser.wishList || [];

//   if (wishlist.some((item) => item.id === productId)) {
//     wishListUpdated(wishlist, productId, btn);
//   } else {
//     wishListUpdated(wishlist, productId, btn);
//   }
// }

// export async function wishListUpdated(_wishList, _productId, btn) {
//   let product = await getProduct.find((product) => product.id === _productId);
//   const currentUsers = JSON.parse(localStorage.getItem("currentUser"));

//   if (_wishList.some((item) => item.id === _productId)) {
//     // Remove product from wishlist
//     _wishList = _wishList.filter((item) => item.id !== _productId);
//     btn.classList.remove("addedtowishlist");
//     showToastAdded(
//       `Product has been deleted from your wishlist.`,
//       "text-bg-danger"
//     );
//   } else {
//     // Add product to wishlist
//     _wishList.push(product);
//     btn.classList.add("addedtowishlist");
//     showToastAdded(
//       `Product has been added to your wishlist.`,
//       "text-bg-success"
//     );
//   }

// Update currentUser wishlist
//   currentUsers.wishList = _wishList;
//   localStorage.setItem("currentUser", JSON.stringify(currentUsers));
// }
export function showToastAdded(messg, added) {
  const toastHTML = `
    <div class= role="alert" aria-live="assertive" aria-atomic="true">
  <div class="${added} d-flex">
   <div class="toast-body">
${messg}
   </div>
   <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  </div>
  `;

  // Create a new toast element
  const toastElement = document.createElement("div");
  toastElement.innerHTML = toastHTML;
  toastElement.className = ` fixed-top p-1 w-25 toast align-items-center mx-auto ${added} border-0`; // Add fixed-top class to position at top of page
  toastElement.style.top = "10px"; // Add some margin from top
  toastElement.style.right = "10px"; // Add some margin from right
  toastElement.style.zIndex = "1000"; // Make sure it's on top of other elements

  // Add the toast element to the body
  document.body.appendChild(toastElement);

  // Create a new Bootstrap Toast instance
  const toast = new bootstrap.Toast(toastElement);

  // Show the toast message
  toast.show();
  // Hide the toast message after 3 seconds
  setTimeout(() => {
    toast.hide();
  }, 3000);
}
export function updateWishlistButtonStates() {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.log("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.log("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);
  const user = users.find((user) => user.id === currentUser.id);

  if (!user) {
    console.log("Current user not found in users.");
    return;
  }

  let wish = user.wishList || [];
  const wishlistButtons = document.querySelectorAll("[data-product-id]");

  wishlistButtons.forEach((btn) => {
    const productId = btn.dataset.productId;
    const product = getProduct.find(
      (product) => product.id === Number(productId)
    );

    if (wish.find((s) => s.id === product.id)) {
      btn.classList.add("addedtowishlist");
    } else {
      btn.classList.remove("addedtowishlist");
    }
  });
}
