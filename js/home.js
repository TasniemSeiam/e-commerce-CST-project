import { showToastUser } from "./config.js";

let categoriesarr = [],
  productsarr = []; // =>
let selsectSearch = document.querySelector(".selsectSearch");
let searchInput = document.querySelector(".searchInput");
let showCategories = document.querySelector(".showCategories");
let sliderHeader = document.querySelector(".sliderHeader");
let bigSaleSection = document.querySelector(".bigSaleSection");
let adv = document.querySelector(".advertise .row");
let flashDeals = document.querySelector(".flashDeals>ul");
let tabContent2 = document.querySelector("#pills-tabContent2");
let imgrigthero = document.querySelectorAll(".imgrigthero")[0];
let imgright = imgrigthero.children[0];
let pright = imgrigthero.children[1];
let imgrigthero1 = document.querySelectorAll(".imgrigthero")[1];
let imgright1 = imgrigthero1.children[0];
let pright1 = imgrigthero1.children[1];

let getProduct = JSON.parse(localStorage.getItem("products"));

let checkLogOut = document.querySelector(".user__check");
let welcomeMessage = document.querySelector(".welcoming__message");
addEventListener("load", async function () {
  try {
    await loadProducts();
  } catch (e) {
    console.log("error when loading data" + e);
  }


  // Check if a user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    checkLogOut.innerHTML = "";
    checkLogOut.innerHTML = "Logout";
    welcomeMessage.innerHTML = "";
    welcomeMessage.innerHTML = `Welcome Back ${currentUser.username} 👋`;
    // Example usage after successful login
    showToastUser("Welcome! You have successfully logged in.", true, 2000);
  }

  // Logout functionality
  if (currentUser) {
    checkLogOut.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      localStorage.setItem("logoutMessage", "You have been logged out.");
      checkLogOut.innerHTML = "";
      checkLogOut.innerHTML = "Sign-In";
      welcomeMessage.innerHTML = "";
      welcomeMessage.innerHTML = `Welcome to ITI Marketplace`;
      window.location.href = "login.html"; // Redirect to the home page or login page
    });
  }

  getCategories(getProduct).forEach((cat) => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    selsectSearch.appendChild(option);
    searchInput.addEventListener("focus", () => {
      window.location.href = "../productsSearch.html?";
    });
  }); // search select option

  getCategories(getProduct).forEach((cat) => {
    // left side product of category
    let category = document.createElement("a");
    category.textContent = cat;
    category.href = "../productsSearch.html?filter=" + cat;
    category.className =
      "list-group-item list-group-item-action py-3 text-capitalize ";
    category.setAttribute("data-filter", cat);
    showCategories.appendChild(category);
    console.log(cat);
  }); // end left side in hero the categories

  for (let i = 0; i < 3; i++) {
    let product = getProduct[i];
    let productDiv = document.createElement("div");
    // productDiv.style.background = `url('${product.image[0]}') no-repeat  center center`;
    // productDiv.style.backgroundSize = "cover";
    // productDiv.style.height="100%";
    let upperHero = document.createElement("div");
    upperHero.className = "upperHero px-1 text-center";
    upperHero.innerHTML = `<h3 class="text-warning">${product.title}</h3>
        <p class="text-secondary mx-auto">${product.description}</p>
        <a href="product_details.html" class=" mt-4 btn btn-warning py-2 rounded-pill w-50">Discover Now</a>`;
    productDiv.appendChild(upperHero);
    if (i == 0) {
      productDiv.className = "carousel-item  active col-12  ";
    } else {
      productDiv.className = "carousel-item col-12  ";
    }
    let image = document.createElement("img");
    image.className = "d-block w-100 ";

    image.src = product.image[0];
    image.alt = product.title;
    productDiv.appendChild(image);
    sliderHeader.appendChild(productDiv);
    // console.log(product)
  }
  // // best sale section
  let randomadv = randomproduct(getProduct, getProduct.length); // display the random product
  randomadv.forEach((pro, i) => {
    imgright.src = pro.image[0];
    imgright1.src = pro.image[1];
    pright.innerHTML = `$${pro.price}
        ${pro.title}`;
    pright1.innerHTML = `$${pro.price}
        ${pro.title}`;
    // console.log(i)
  });
  //caursel header

  // every slider has its own id
  let nP = document.querySelectorAll(".bestSale #pills-tab li > ._role");
  let nextprevBtn = document.querySelectorAll(".nextprevBtn");
  nP.forEach((btn, index) => {
    colorActived(btn);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      // colorActived(e.target);

      console.log(e.target.id);
      if (e.target.id == "pills-product-tab") {
        nextprevBtn.forEach((nextPrev, i) => {
          nextPrev.setAttribute("data-bs-target", "#divOFbestselleng");
        });
      } else if (e.target.id == "pills-newArrival-tab") {
        nextprevBtn.forEach((nextPrev, i) => {
          nextPrev.setAttribute("data-bs-target", "#divOFnewArrival");
          // console.log(nextPrev.getAttribute("data-bs-target"));
        });
      } else {
        nextprevBtn.forEach((nextPrev, i) => {
          nextPrev.setAttribute("data-bs-target", "#divOFRandom");
        });
      }
    });
  }); // end every slider has its own id

  displayBigSales(0, bigSaleSection); // display the big sales
  sillingProduct(); // display the sales section
  displayBigSales(0, adv); // display the big sales
  onSale(getProduct); //display On sale section
  flashsection(getProduct); //display On flash section
}); // end loading
async function loadProducts() {
  getProduct = JSON.parse(localStorage.getItem("products"));
  if (!getProduct || getProduct.length == 0) {
    products = await fetch("../data/products.json");
    getProduct = await products.json();
    localdata = JSON.stringify(getProduct);
    localStorage.setItem("products", localdata);
    // console.log(localdata);
    return getProduct;
  } else {
    // console.log(getProduct);
    return getProduct;
  }
}
// let checkLogOut = document.querySelector(".user__check");
// let welcomeMessage = document.querySelector(".welcoming__message");
// addEventListener("load", function () {
//   try {
//     loadProducts();
//   } catch (e) {
//     console.log("error when loading data" + e);
//   }

function getCategories(getProduct) {
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

function displayProduct(product, _location) {
  let productDiv = document.createElement("div");
  productDiv.className = "col-12 col-sm-6 col-md-3 col-lg  px-2 mb-2";
  let productCard = document.createElement("div");
  productCard.className = "card text-center cardProducts";
  productCard.setAttribute("id", `pro${product.id}`);
  let divHeart = document.createElement("div");
  divHeart.className = "position-relative divheart";
  let imgsDiv = document.createElement("div");
  imgsDiv.className = "imgsDiv position-relative p-1";
  let imgs = document.createElement("img");
  imgs.className = "   mx-auto card-img-top";
  imgs.src = product.image[0];
  imgs.alt = product.title;
  let imgs2 = document.createElement("img");
  imgs2.className = " imgs2  mx-auto card-img-top ";
  imgs2.src = product.image[1];
  imgs2.alt = product.title;
  let wishlistBtn = document.createElement("span");
  wishlistBtn.title = "add to wishlist";

  wishListBtnStates(wishlistBtn, product);
  let productCount = document.createElement("div");
  productCount.className =
    "productCount bg-danger text-center rounded-top text-white";
  productCount.innerHTML = `<span>out of stock</span>`;
  if (product.rating.count == 0) {
    productDiv.appendChild(productCount);
  }
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
  wishlistBtn.addEventListener("click", async function (e) {
    // if (currentser) {
    addToWishlist(product.id, e.target);
    const currentState = e.target.classList.contains("addedtowishlist");

    // Toggle the class
    e.target.classList.toggle("addedtowishlist");

    // Update local storage
    const wishlistBtnState = localStorage.getItem("wishlist-btn-state");
    let btnStateObj = {};

    if (wishlistBtnState) {
      btnStateObj = await JSON.parse(wishlistBtnState);
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
}
function getBigSales(products) {
  let bigSales = products.filter((product) => {
    return product.rating.count < 150;
  });
  return bigSales;
} //return array of product's count < 150

function randomproduct(getproduct, num) {
  let numRandomProducts = num; // number of random products to select

  let randomProducts = [];
  while (randomProducts.length < numRandomProducts) {

    const randomIndex = Math.floor(Math.random() * getproduct.length);
    let newprod = getProduct.slice();
    randomProducts.push(newprod.splice(randomIndex, 1)[0]);
  }
  console.log("random array " + randomProducts); // array of random products
  return randomProducts; // array of random products
}

function displayBigSales(x, sect) {
  let bigSale = getBigSales(getProduct); // big sales array products < 150
  console.log(bigSale);
  if (bigSale.length > 0) {
    for (let i = x; i < x + 3; i++) {
      let bigsaleDivwrapper = document.createElement("div");
      bigsaleDivwrapper.className = "discounts col-12 col-md-4 mb-3";
      let bigsaleDiv = document.createElement("div");
      bigsaleDiv.className =
        " position-relative overflow-hidden rounded rounded-3 p-2 bg-white h-100";
      let img = document.createElement("img");
      img.className = "w-100 img-flued h-100 ";
      img.src = bigSale[i].image[0];
      img.alt = bigSale[i].title;
      let forntDiv = document.createElement("div");
      forntDiv.classList.add("forntDiv");
      let fornthDiv = document.createElement("div");
      fornthDiv.classList.add("fornthDiv");
      let frontdark = document.createElement("div");
      frontdark.className = "frontdark rounded";
      let upperProductDis = document.createElement("div");
      upperProductDis.className = "upperProductDis px-4 py-2";
      upperProductDis.innerHTML = `<h3 class="">Big Sales</h3>
                  <h5 class="">${bigSale[i].title}</h5>
                  <p class="">${bigSale[i].price}</p>
                  <a href="product_details.html" class="text-decoration-underline text-white ">Discover Now</a>`;
      bigsaleDiv.appendChild(img);
      bigsaleDiv.appendChild(upperProductDis);
      bigsaleDiv.appendChild(forntDiv);
      bigsaleDiv.appendChild(fornthDiv);
      bigsaleDiv.appendChild(frontdark);
      bigsaleDivwrapper.appendChild(bigsaleDiv);
      sect.appendChild(bigsaleDivwrapper);
    }
  } else {
    // console.log("no big sales products");
    sect.innerHTML = "<h4>No big sales products available</h4>";
  }
} // end big sale section

function sillingProduct() {
  // product
  let carouselItemDiv1 = document.querySelectorAll(
    ".divOFbestselleng .divOFbestsellengProduct1 .carousel-item .row"
  )[0];
  silingProductFromstart(0, 5, getProduct, carouselItemDiv1);
  let carouselItemDiv2 = document.querySelectorAll(
    ".divOFbestselleng .divOFbestsellengProduct1 .carousel-item .row"
  )[1];
  silingProductFromstart(5, 10, getProduct, carouselItemDiv2);

  // new arrival product
  let carouselItemnewArrival1 = document.querySelectorAll(
    ".divOFnewArrival .divOFbestsellengnewArrival .carousel-item .row"
  )[0];
  let numOfLength = getProduct.length - 1;

  silingProductFromend(
    numOfLength,
    numOfLength - 5,
    getProduct,
    carouselItemnewArrival1
  );

  let carouselItemnewArrival2 = document.querySelectorAll(
    ".divOFnewArrival .divOFbestsellengnewArrival .carousel-item .row"
  )[1];
  silingProductFromend(
    numOfLength - 5,
    numOfLength - 10,
    getProduct,
    carouselItemnewArrival2
  );

  //random product
  let carouselItemRandom1 = document.querySelectorAll(
    ".divOFRandom .divOFbestsellengrandom .carousel-item .row"
  )[0];
  let randomItems = randomproduct(getProduct, getProduct.length);
  silingProductFromstart(0, 5, randomItems, carouselItemRandom1);

  let carouselItemRandom2 = document.querySelectorAll(
    ".divOFRandom .divOFbestsellengrandom .carousel-item .row"
  )[1];
  silingProductFromstart(5, 10, randomItems, carouselItemRandom2);
}
function silingProductFromstart(_start, _end, _data, _loc) {
  for (let i = _start; i < _end; i++) {
    let items = _data[i];
    displayProduct(items, _loc);
  }
}
function silingProductFromend(_start, _end, _data, _loc) {
  for (let i = _start; i > _end; i--) {
    let items = _data[i];
    displayProduct(items, _loc);
  }
}

function flashsection(products) {
  getCategories(products).forEach((cat, i) => {
    let catWithoutSpace = cat.split(" ");
    let catWithoutSpaceStr = catWithoutSpace.join("");
    catWithoutSpaceStr = catWithoutSpaceStr.split("'");
    catWithoutSpaceStr = catWithoutSpaceStr.join("");
    // let catWithoutSpaceStr = cat.replace(/\s|'/g, "");
    // console.log(catWithoutSpace);
    // console.log(catWithoutSpaceStr);
    // buttons in flash section
    let li1 = document.createElement("li");
    li1.className = "nav-item me-1";
    li1.setAttribute("role", "presentation");
    let button1 = document.createElement("button");
    button1.className = "border-0";
    button1.setAttribute("id", `pills-${catWithoutSpaceStr}-tab`);
    button1.setAttribute("data-bs-toggle", "pill");
    button1.setAttribute("data-bs-target", `#pills-${catWithoutSpaceStr}`);
    button1.setAttribute("type", "button");
    button1.setAttribute("role", "tab");
    button1.setAttribute("aria-controls", `pills-${catWithoutSpaceStr}`);
    button1.textContent = cat;
    colorActived(button1);
    li1.appendChild(button1);
    flashDeals.appendChild(li1);
    let tabPane1FlashSeller = document.createElement("div");
    if (i == 0) {
      tabPane1FlashSeller.className = " tab-pane fade show active";
      button1.classList.add("text-warning");
    } else {
      tabPane1FlashSeller.className = "tab-pane fade";
    }
    tabPane1FlashSeller.setAttribute("id", `pills-${catWithoutSpaceStr}`);
    tabPane1FlashSeller.setAttribute("role", "tabpanel");
    tabPane1FlashSeller.setAttribute(
      "aria-labelledby",
      `pills-${catWithoutSpaceStr}-tab`
    );

    let divRow = document.createElement("div");
    divRow.className = "row row-cols-lg-5 justify-content-center";
    // let t = "men's clothing";
    // button1.addEventListener("click", function (e) {
    //     t=e.target.textContent
    //     filteredProductsByCategory(products,t,divRow)
    // });
    let t = tabPane1FlashSeller.getAttribute("id");
    let f = button1.getAttribute("data-bs-target");
    if ("#" + t == f) {
      filteredProductsByCategory(products, cat, divRow);
    }
    tabPane1FlashSeller.appendChild(divRow);
    tabContent2.appendChild(tabPane1FlashSeller);
  });
}

function onSale(products) {
  let onSalediv = document.querySelector("#onSale div .row");
  for (let i = 0; i < 6; i++) {
    let product = products[i];
    let onsalecol = document.createElement("div");
    onsalecol.className = "col-12 col-sm-6 col-md-4  cardOnsale";
    let cardDiv = document.createElement("div");
    cardDiv.className = "card mb-3 p-2 py-3";
    cardDiv.setAttribute("id", `product${product.id}`);
    let rowdiv = document.createElement("div");
    rowdiv.className = "row g-0";
    let divs = document.createElement("div");
    divs.className = "col-md-4 divsimg position-relative";
    // let imgsDiv = document.createElement("div");
    // imgsDiv.className = "imgsDiv position-relative p-1";
    let imgs = document.createElement("img");
    imgs.className = "   mx-auto card-img-top";
    imgs.src = product.image[0];
    imgs.alt = product.title;
    let imgs2 = document.createElement("img");
    imgs2.className = " imgs2  mx-auto card-img-top ";
    imgs2.src = product.image[1];
    imgs2.alt = product.title;
    divs.appendChild(imgs);
    divs.appendChild(imgs2);
    let divs2 = document.createElement("div");
    divs2.className = "col-md-8";
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
    cardprice.innerHTML = `price: ${product.discount}$ <span
             class="text-muted text-decoration-line-through ms-4">${product.price}$</span>`;
    let cardBtns = document.createElement("div");
    cardBtns.className = "btn-group";
    let addToCartBtn = document.createElement("button");
    addToCartBtn.className = "addtocart";
    addToCartBtn.innerHTML = '<i class="fa-solid fa-plus addtocartIcon"></i>';
    let addTofavBtn = document.createElement("button");
    addTofavBtn.className = "addtofav ";

    wishListBtnStates(addTofavBtn, product);

    // const wishlistBtnState = localStorage.getItem('wishlist-btn-state') || [];
    // let btnStateObj = {};

    // if (wishlistBtnState) {
    //     btnStateObj = JSON.parse(wishlistBtnState);
    // }
    // if ((wishlistBtnState.indexOf(product.id) !== -1)) {

    //     if (btnStateObj[product.id]) {

    //         addTofavBtn.className = "addtofav addedtowishlist "
    //     } else {
    //         addTofavBtn.className = "addtofav"
    //     }

    // }

    addTofavBtn.innerHTML = '<i class="fa-solid fa-heart addTofavIcon "></i>';
    addToCartBtn.classList.add("btn", "btn-outline-warning", "addtocartBtn");

    addToCartBtn.addEventListener("click", function (e) {
      // if (currentuser) {
      addToCart(product.id);
      // } else {
      // e.preventDefault();
      //  alert("Please login to add to cart");
      // }
    });
    addTofavBtn.addEventListener("click", async function (e) {
      // if (currentuser) {
      addToWishlist(product.id, e.target);

      const currentState = e.target.classList.contains("addedtowishlist");

      // Toggle the class
      e.target.classList.toggle("addedtowishlist");

      // Update local storage
      const wishlistBtnState = localStorage.getItem("wishlist-btn-state");
      let btnStateObj = {};

      if (wishlistBtnState) {
        btnStateObj = await JSON.parse(wishlistBtnState);
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

    addTofavBtn.classList.add("btn", "btn-outline-warning", "addtofavBtn");
    cardBtns.appendChild(addToCartBtn);
    cardBtns.appendChild(addTofavBtn);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardRate);
    cardBody.appendChild(cardprice);
    cardBody.appendChild(cardBtns);
    divs2.appendChild(cardBody);
    rowdiv.appendChild(divs);
    rowdiv.appendChild(divs2);
    cardDiv.appendChild(rowdiv);

    onsalecol.appendChild(cardDiv);

    onSalediv.appendChild(onsalecol);
  }
}

function colorActived(ele) {
  ele.addEventListener("click", function (e) {
    $(e.target).addClass("text-warning");
    $(e.target).parent().siblings().children().removeClass("text-warning");
  });
} // active btn

async function filteredProductsByCategory(
  products,
  _textcontent,
  _locAppendto
) {
  _locAppendto.innerHTML = "";
  let filterProducts = products.filter(
    (product) => product.category == _textcontent
  );
  // console.log(_textcontent.textContent)
  await filterProducts.forEach((filterProduct) => {
    displayProduct(filterProduct, _locAppendto);
  });
}

////// add to cart list

let addToCartList = [];
let cartCount = document.getElementById("cartCount");
let cartdata = JSON.parse(localStorage.getItem("cart")) || [];

cartCount.textContent = cartdata ? cartdata.length : 0;

async function addToCart(productId) {
  let cartdata = await JSON.parse(localStorage.getItem("cart"));
  // console.log('Cart data', cartdata.length);
  if (cartdata && cartdata.length > 0) {
    cartListUpdated(cartdata, productId);
  } else {
    cartListUpdated(addToCartList, productId);
  }
}
function cartListUpdated(_cartdata, _productId) {
  let product = getProduct.find((product) => product.id === _productId);
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
// let wishlistdata = JSON.parse(localStorage.getItem("wishlist")) || [];
async function addToWishlist(productId, btn) {
  let wishlistdata = await JSON.parse(localStorage.getItem("wishlist"))||[];
  if (wishlistdata && wishlistdata.length > 0) {
    wishListUpdated(wishlistdata, productId, btn);
  } else {
    wishListUpdated(wishList, productId, btn);
  }
}


function wishListUpdated(_wishList, _productId) {
  let product = getProduct.find((product) => product.id === _productId);
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

// function wishListUpdated(_wishList, _productId, btn) {
//     let product = getProduct.find(product => product.id === _productId);
//     // if (_wishList.includes(_productId))  {
//     if (_wishList.some(item => item.id === _productId)) {
//         updatedWishlist = _wishList.filter((item) => item.id !== _productId);
//         localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

//         // btn.classList.remove("addedtowishlist");
//         alert('This product has been deleted from your wishlist');
//     } else {
//         // if ((product.rating.count) > 0) {}
//         // btn.classList.add("addedtowishlist")
//         _wishList.push(product);
//         alert(`Product "${product.title}" has been added to your wishlist.`);
//         // displayWishlistList();
//         localStorage.setItem("wishlist", JSON.stringify(_wishList));
//         console.log('Wishlist', _wishList);

//     }
// }

async function wishListBtnStates(_wishListBtn, _data) {
  const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
  let btnStateObj = {};

  if (wishlistBtnState) {
    btnStateObj = await JSON.parse(wishlistBtnState);
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

// Show button when user scrolls down
const backToTopBtn = document.getElementById("backToTopBtn");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (
    document.body.scrollTop > 150 ||
    document.documentElement.scrollTop > 150
  ) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}
// scroll to top
backToTopBtn.addEventListener("click", () => {
  document.documentElement.scrollTop = 0; // chrome scroll
  document.body.scrollTop = 0; // firefox scroll
});
