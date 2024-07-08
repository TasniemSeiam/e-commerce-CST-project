// let wrapperDiv = document.querySelector(".wrapperDiv");
// // const filteredProductsContainer = document.querySelector('.test');
// const filteredProducts = JSON.parse(localStorage.getItem('filteredProducts'));
// const getProduct = JSON.parse(localStorage.getItem("products"));

// if (filteredProducts) {
//     displayProduct(filteredProducts)

// } else {
//         displayProduct(getProduct)
// }

const wrapperDiv = document.querySelector(".wrapperDiv");
let searchBTN = document.querySelector(".searchBTN");
const urlParams = new URLSearchParams(window.location.search);
const filterText = urlParams.get("filter");

const products = JSON.parse(localStorage.getItem("products")) || [];
let categoriesarr = [];
let selsectSearch = document.querySelector(".selsectSearch");
let searchInput = document.querySelector(".searchInput");
// addEventListener("load", function () {

getCategories(products).forEach((cat) => {
  let option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  selsectSearch.appendChild(option);
  selsectSearch.addEventListener("change", function (e) {
    // loadProductByCategory(e.target.value);
    searchInput.focus();
  });
});
/// filter by category
if (filterText) {
  // const products = JSON.parse(localStorage.getItem('products'))||[];
  const filteredProducts = products.filter((product) => {
    return product.category.toLowerCase().includes(filterText.toLowerCase());
  });
  if (filteredProducts.length > 0) {
    displayProduct(filteredProducts, wrapperDiv);
  } else {
    wrapperDiv.innerHTML =
      '<h2 class=" w-100 text-center p-5 my-3 ">No products found in this category </h2>';
  }
} else {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  displayProduct(products, wrapperDiv);
}

///////////////// search results
searchInput.focus();

searchBTN.addEventListener("click", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  const selectedCategory = selsectSearch.value;
  let filteredProducts;
  wrapperDiv.innerHTML = ""; // clear previous content

  if (!selectedCategory) {
    filteredProducts = JSON.parse(localStorage.getItem("products")) || [];
  } else {
    filteredProducts = products.filter((product) => {
      return product.category === selectedCategory;
    });
  }
  if (searchValue) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchValue.toLowerCase());
    });
    // console.log(searchInput.value.trim())
    // console.log(filteredProducts)
    if (filteredProducts.length > 0) {
      displayProduct(filteredProducts, wrapperDiv);
    } else {
      wrapperDiv.innerHTML =
        '<h2 class=" w-100 text-center p-5 my-3 bg-white" >No products found matching your search </h2>';
    }
  }
});
// })/////

function displayProduct(product, _location) {
  product.forEach((product) => {
    let productDiv = document.createElement("div");
    productDiv.className = "col-12 col-sm-6 col-md-3 col-lg  px-2 mb-2";
    let productCard = document.createElement("div");
    productCard.className = "card text-center cardProducts";
    productCard.setAttribute("id", `pro${product.id}`);
    divHeart = document.createElement("div");
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

    const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
    let btnStateObj = {};

    if (wishlistBtnState) {
      btnStateObj = JSON.parse(wishlistBtnState);
    }
    if (wishlistBtnState.indexOf(product.id) !== -1) {
      if (btnStateObj[product.id]) {
        wishlistBtn.classList.add = "addedtowishlist ";

        // addTofavBtn.className = "addtofav addedtowishlist "
      } else {
        // addTofavBtn.className = "addtofav"
        wishlistBtn.classList.remove = "addedtowishlist";
      }
    }

    wishListBtnStates(wishlistBtn, product);

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
    for (let s = 0; s < 4; s++) {
      let li = document.createElement("li");
      li.className = "list-inline-item mr-1 ";
      let star = document.createElement("i");
      star.className = "fa-regular fa-star";
      // star.style.color = s < Math.floor(product.rating.rate) ? "gold" : "gray";
      if (s < Math.floor(product.rating.rate)) {
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

    cartBtn.addEventListener("click", function (e) {
      // if (currentUser) {
      addToCart(product.id);
      // } else {
      // e.preventDefault();
      //  alert("Please login to add to cart");
      // }
    });
    wishlistBtn.addEventListener("click", function (e) {
      // if (currentUser) {
      addToWishlist(product.id, e.target);
      const currentState = e.target.classList.contains("addedtowishlist");

      // Toggle the class
      e.target.classList.toggle("addedtowishlist");

      // Update local storage
      const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
      let btnStateObj = {};

      if (wishlistBtnState) {
        btnStateObj = JSON.parse(wishlistBtnState);
      }

      btnStateObj[product.id] = !currentState;
      console.log(currentState);

      const updatedBtnState = JSON.stringify(btnStateObj);
      localStorage.setItem("wishlist-btn-state", updatedBtnState);
      console.log(wishlistBtnState.indexOf(product.id) !== -1);
      console.log(btnStateObj[product.id]);

      // } else {
      // e.preventDefault();
      //  alert("Please login to add to cart");
      // }
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
  });
}

function getCategories(products) {
  let keys = Object.keys(products);
  keys.forEach((key) => {
    console.log(products[key].category); //categories
    if (categoriesarr.includes(products[key].category)) {
      console.log(products[key].category); //products
    } else {
      categoriesarr.push(products[key].category);
    }
  });
  console.log(categoriesarr);
  return categoriesarr;
}

////// add to cart list

let addToCartList = [];
let cartCount = document.getElementById("cartCount");
let cartdata = JSON.parse(localStorage.getItem("cart")) || [];

cartCount.textContent = cartdata ? cartdata.length : 0;

function addToCart(productId) {
  let cartdata = JSON.parse(localStorage.getItem("cart")) || [];
  // console.log('Cart data', cartdata.length);
  if (cartdata && cartdata.length > 0) {
    cartListUpdated(cartdata, productId);
  } else {
    cartListUpdated(addToCartList, productId);
  }
}
function cartListUpdated(_cartdata, _productId) {
  let product = products.find((product) => product.id === _productId);
  if (_cartdata.some((item) => item.id === _productId)) {
    alert("This product has already been added to the cart.");
  } else {
    if (product.rating.count > 0) {
      _cartdata.push(product);
      cartCount.textContent = _cartdata.length;
      alert(`Product "${product.title}" has been added to the cart.`);
      // displayCartList();
      localStorage.setItem("cart", JSON.stringify(_cartdata));
      console.log("Cart", _cartdata);
    } else {
      alert("This product: " + product.title + " is out of stock.");
    }
  }
}

// add to wishlist  list

let wishList = [];
let wishlistdata = JSON.parse(localStorage.getItem("wishlist")) || [];
function addToWishlist(productId) {
  let wishlistdata = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlistdata && wishlistdata.length > 0) {
    wishListUpdated(wishlistdata, productId);
  } else {
    wishListUpdated(wishList, productId);
  }
}

function wishListUpdated(_wishList, _productId) {
  let product = products.find((product) => product.id === _productId);
  // if (_wishList.includes(_productId))  {
  if (_wishList.some((item) => item.id === _productId)) {
    updatedWishlist = _wishList.filter((item) => item.id !== _productId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // btn.classList.remove("addedtowishlist");
    alert("This product has been deleted from your wishlist");
  } else {
    // if ((product.rating.count) > 0) {}
    // btn.classList.add("addedtowishlist")
    _wishList.push(product);
    alert(`Product "${product.title}" has been added to your wishlist.`);
    // displayWishlistList();
    localStorage.setItem("wishlist", JSON.stringify(_wishList));
    console.log("Wishlist", _wishList);
  }
}

function wishListBtnStates(_wishListBtn, _data) {
  const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
  let btnStateObj = {};

  if (wishlistBtnState) {
    btnStateObj = JSON.parse(wishlistBtnState);
  }
  if (wishlistBtnState.indexOf(_data.id) !== -1) {
    if (btnStateObj[_data.id]) {
      _wishListBtn.classList.add = "addedtowishlist ";

      // addTofavBtn.className = "addtofav addedtowishlist "
    } else {
      // addTofavBtn.className = "addtofav"
      _wishListBtn.classList.remove = "addedtowishlist";
    }
  }
}
