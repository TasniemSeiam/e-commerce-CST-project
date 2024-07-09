import { showToastUser, currentUser } from "./config.js";
import { addToCart,cartListUpdated,displayProduct,addToWishlist,getCategories,wishListUpdated} from "./sharedHome.js";
let categoriesarr = [];
// productsarr = []; // =>
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

addEventListener("load", async function () {
  try {
    await loadProducts();
  } catch (e) {
    console.log("error when loading data" + e);
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
        <a href="productCatalog.html" class=" mt-4 btn btn-warning py-2 rounded-pill w-50">Discover Now</a>`;
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
  nP.forEach((btn) => {
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
    location.reload();
    return getProduct;
  } else {
    // console.log(getProduct);
    return getProduct;
  }
}

// Check if a user is logged in
currentUser();
let currentUsers = JSON.parse(localStorage.getItem("currentUser")) || [];
// function getCategories(getProduct) {
//   let keys = Object.keys(getProduct);
//   keys.forEach((key) => {
//     console.log(getProduct[key].category); //categories
//     if (categoriesarr.includes(getProduct[key].category)) {
//       console.log(getProduct[key].category); //products
//     } else {
//       categoriesarr.push(getProduct[key].category);
//     }
//   });
//   console.log(categoriesarr);
//   return categoriesarr;
// }

// function displayProduct(product, _location) {
//   // product.forEach((product) => {
//   let productDiv = document.createElement("div");
//   productDiv.className = "col-12 col-sm-6 col-md-3 col-lg  px-2 mb-2";
//   let productCard = document.createElement("div");
//   productCard.className = "card text-center cardProducts";
//   productCard.setAttribute("id", `pro${product.id}`);
//   let divHeart = document.createElement("div");
//   divHeart.className = "position-relative divheart";
//   let imgsDiv = document.createElement("div");
//   imgsDiv.className = "imgsDiv position-relative p-1";
//   let imgs = document.createElement("img");
//   imgs.className = " imgs  mx-auto card-img-top";
//   imgs.src = product.image[0];
//   imgs.alt = product.title;
//   let imgs2 = document.createElement("img");
//   imgs2.className = " imgs2  mx-auto card-img-top ";
//   imgs2.src = product.image[1];
//   imgs2.alt = product.title;
//   let wishlistBtn = document.createElement("span");
//   wishlistBtn.title = "add to wishlist";
//   wishlistBtn.className =
//     "mx-auto mx-md-0  wishlistHeart btn-white  rounded-circle fas fa-heart wishlistHearti";

//   wishlistBtn.setAttribute("data-product-id", product.id);

//   // let currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   if (currentUsers) {
//     console.log("loged in as current user");
//   }
//   let wish = currentUsers.wishList;

//   // Get all wishlist buttons
//   const wishlistButtons = document.querySelectorAll("[data-product-id]");

//   // Loop through each button and update its state
//   wishlistButtons.forEach((btn) => {
//     const productId = btn.dataset.productId;
//     const product = getProduct.find(
//       (product) => product.id === Number(productId)
//     );

//     if (wish.find((s) => s.id === product.id)) {
//       btn.classList.add("addedtowishlist");
//     } else {
//       btn.classList.remove("addedtowishlist");
//     }
//   });

//   // const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
//   // let btnStateObj = {};

//   // if (wishlistBtnState) {
//   //   btnStateObj = JSON.parse(wishlistBtnState);
//   // }
//   // if (wishlistBtnState.indexOf(product.id) !== -1) {
//   //   if (btnStateObj[product.id]) {
//   //     wishlistBtn.classList.add = "addedtowishlist ";

//   //     // addTofavBtn.className = "addtofav addedtowishlist "
//   //   } else {
//   //     // addTofavBtn.className = "addtofav"
//   //     wishlistBtn.classList.remove = "addedtowishlist";
//   //   }
//   // }

//   // wishListBtnStates(wishlistBtn, product);

//   imgsDiv.appendChild(imgs);
//   imgsDiv.appendChild(imgs2);
//   divHeart.appendChild(imgsDiv);
//   divHeart.appendChild(wishlistBtn);
//   let cardBody = document.createElement("div");
//   cardBody.className = "card-body";
//   let cardTitle = document.createElement("p");
//   cardTitle.className = "card-title text-primary";
//   cardTitle.textContent = product.title;
//   let cardRate = document.createElement("ul");
//   cardRate.className = "list-inline mb-1";
//   for (let s = 0; s < 4; s++) {
//     let li = document.createElement("li");
//     li.className = "list-inline-item mr-1 ";
//     let star = document.createElement("i");
//     star.className = "fa-regular fa-star";
//     // star.style.color = s < Math.floor(product.rating.rate) ? "gold" : "gray";
//     if (s < Math.floor(product.rating.rate)) {
//       star.style.color = "gold";
//       star.removeClassName = "fa-regular";
//       star.classList.add("fa-solid");
//     } else {
//       star.style.color = "gray";
//       star.removeClassName = "fa-solid";
//       star.classList.add("fa-regular");
//     }
//     li.appendChild(star);
//     cardRate.appendChild(li);
//   }
//   let cardprice = document.createElement("h6");
//   cardprice.textContent = "price: " + product.price + "$";
//   let cartBtndiv = document.createElement("div");
//   cartBtndiv.className = "cartBtndiv pt-2 pt-sm-0";
//   let cartBtn = document.createElement("button");
//   cartBtn.textContent = "Add to Cart";
//   cartBtn.className =
//     "btn mx-auto mx-md-0 text-center btn-warning addToCart  rounded-pill";
//   // wishListBtnStates(wishlistBtn, product, currentUsers.id);

//   cartBtn.addEventListener("click", function (e) {
//     if (currentUsers) {
//       addToCart(product.id);
//     } else {
//       e.preventDefault();
//       window.location.href = "../login.html";
//     }
//   });
//   wishlistBtn.addEventListener("click", function (e) {
//     // wishListBtnStates(e.target, product);

//     if (currentUsers) {
//       addToWishlist(product.id, e.target);
//       console.log("Wishlist", currentUsers.wishList);
//     } else {
//       e.preventDefault();
//       window.location.href = "./login.html";
//     }
//     console.log(currentUsers.wishList);
//   });

//   cardBody.appendChild(cardTitle);
//   cardBody.appendChild(cardRate);
//   cardBody.appendChild(cardprice);
//   cartBtndiv.appendChild(cartBtn);
//   cardBody.appendChild(cartBtndiv);
//   productCard.appendChild(divHeart);
//   productCard.appendChild(cardBody);
//   productDiv.appendChild(productCard);
//   _location.appendChild(productDiv);
//   // });
// }

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
  // console.log("random array " + randomProducts); // array of random products
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

  // //random product
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
    // let catWithoutSpace = cat.split(" ");
    // let catWithoutSpaceStr = catWithoutSpace.join("");
    // catWithoutSpaceStr = catWithoutSpaceStr.split("'");
    // catWithoutSpaceStr = catWithoutSpaceStr.join("");
    let catWithoutSpaceStr = cat.replace(/\s|'/g, "");
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
    for (let s = 0; s < 5; s++) {
      let li = document.createElement("li");
      li.className = "list-inline-item mr-1 ";
      let star = document.createElement("i");
      star.className = "fa-regular fa-star";
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
    cardprice.innerHTML = `price: ${product.discount}$ <span
             class="text-muted text-decoration-line-through ms-4">${product.price}$</span>`;
    let cardBtns = document.createElement("div");
    cardBtns.className = "btn-group";
    let addToCartBtn = document.createElement("button");
    addToCartBtn.className = "addtocart ";
    addToCartBtn.innerHTML = '<i class="fa-solid fa-plus addtocartIcon"></i>';
    let addTofavBtn = document.createElement("button");
    addTofavBtn.className = "addtofav ";
    addTofavBtn.setAttribute("data-product-id", product.id);
    addTofavBtn.innerHTML = '<i class="fa-solid fa-heart addTofavIcon "></i>';
    addToCartBtn.classList.add("btn", "btn-outline-warning", "addtocartBtn");
    addTofavBtn.classList.add("btn", "btn-outline-warning", "addtofavBtn");

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let wish = currentUser.wishList;

    // Get all wishlist buttons
    const wishlistButtons = document.querySelectorAll("[data-product-id]");

    // Loop through each button and update its state
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

    addToCartBtn.addEventListener("click", function (e) {
      if (currentUsers) {
        addToCart(product.id);
      } else {
        e.preventDefault();
        window.location.href = "../login.html";
      }
    });

    addTofavBtn.addEventListener("click", async function (e) {
      if (currentUsers) {
        addToWishlist(product.id, e.target);
        console.log("Wishlist", currentUsers.wishList);
      } else {
        e.preventDefault();
        window.location.href = "./login.html";
      }
      console.log(currentUsers.wishList);

      // console.log(wish[0].id===product.id);
      // if (states) {
      //   addTofavBtn.classList.add("addedtowishlist");
      // } else {
      //   addTofavBtn.classList.remove("addedtowishlist");
      // }
    });
    // if (currentUser && currentUser.wishList.includes(product.id)) {
    //   addTofavBtn.classList.add("addedtowishlist");
    // } else {
    //   addTofavBtn.classList.remove("addedtowishlist");
    // }
    // addTofavBtn.addEventListener("click", async function (e) {
    //   console.log("userWishlist", userWishlist);
    //   // Add event listeners to the favorite buttons

    //   const productId = addTofavBtn.dataset.productId;
    //   let product = getProduct.find(
    //     (product) => product.id === Number(productId)
    //   );
    //   console.log(product.id, Number(productId));
    //   // Toggle the 'added-to-wishlist' class on the button
    //   addTofavBtn.classList.toggle("addedtowishlist");
    //   // Update the user's wishlist in local storage
    //   if (addTofavBtn.classList.contains("addedtowishlist")) {
    //     userWishlist.push(product);
    //   } else {
    //     const index = userWishlist.indexOf(productId);
    //     if (index !== -1) {
    //       userWishlist.splice(index, 1);
    //     }
    //   }
    //   currentUsers.wishList = userWishlist;
    //   // localStorage.setItem('currentUser', JSON.stringify(currentUsers));
    //   localStorage.setItem("currentUser", JSON.stringify(currentUsers));

    //   // if (currentUsers) {
    //   //   addToWishlist(product.id, e.target);
    //   //   // wishListBtnStates(e.target, product);
    //   // } else {
    //   //   e.preventDefault();
    //   //   window.location.href = "../login.html";
    //   // }

    //   // wishListBtnStates(addTofavBtn, product, currentUsers.id);

    //   // const currentState = e.target.classList.contains("addedtowishlist");

    //   // // Toggle the class
    //   // e.target.classList.toggle("addedtowishlist");

    //   // // Update local storage
    //   // const wishlistBtnState = localStorage.getItem("wishlist-btn-state");
    //   // let btnStateObj = {};

    //   // if (wishlistBtnState) {
    //   //   btnStateObj = await JSON.parse(wishlistBtnState);
    //   // }

    //   // btnStateObj[product.id] = !currentState;
    //   // console.log(currentState);

    //   // const updatedBtnState = JSON.stringify(btnStateObj);
    //   // localStorage.setItem("wishlist-btn-state", updatedBtnState);
    //   // console.log(wishlistBtnState.indexOf(product.id) !== -1);
    //   // console.log(btnStateObj[product.id]);

    //   // } else {
    //   // e.preventDefault();
    //   //  alert("Please login to add to cart");
    //   // }
    // });

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

// ////// add to cart list

// let addToCartList = [];
// let cartCount = document.getElementById("cartCount");
// // let cartdata = JSON.parse(localStorage.getItem("cart")) || [];
// let cartdata = currentUsers.cart;

// cartCount.textContent = cartdata ? cartdata.length : 0;

// function addToCart(productId) {
//   // let cartdata =  JSON.parse(localStorage.getItem("cart"));
//   // console.log('Cart data', cartdata.length);
//   if (cartdata && cartdata.length > 0) {
//     cartListUpdated(cartdata, productId);
//   } else {
//     cartListUpdated(addToCartList, productId);
//   }
// }
// function cartListUpdated(_cartdata, _productId) {
//   let product = getProduct.find((product) => product.id === _productId);
//   if (_cartdata.some((item) => item.id === _productId)) {
//     alert("This product has already been added to the cart.");
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

// // add to wishlist  list

// // let wishList = [];
// // let wishlistdata = JSON.parse(localStorage.getItem("wishlist")) || [];
// // let wishlistdata =currentUser.wishList;
// // let wishlistdata =[...currentUsers.wishList];
// // async function addToWishlist(productId, btn) {
// //   let wishlistdata = await JSON.parse(localStorage.getItem("currentUser")) || [];
// //   // wishlistdata =currentUsers.wishList ;
// //   wishlistdata = wishlistdata.wishList;
// //   if (wishlistdata && wishlistdata.length > 0) {
// //     wishListUpdated(wishlistdata, productId, btn);
// //   } else {
// //     // wishListUpdated(wishList, productId, btn);
// //     wishListUpdated(wishlistdata, productId, btn);
// //   }
// // }

// // async function wishListUpdated(_wishList, _productId) {
// //   let product = await getProduct.find((product) => product.id === _productId);
// //   // if (_wishList.includes(_productId))  {
// //   if (_wishList.some((item) => item.id === _productId)) {
// //     let updatedWishlist = _wishList.filter((item) => item.id !== _productId);
// //     // localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
// //     wishlistdata = updatedWishlist;
// //     localStorage.setItem("currentUser", JSON.stringify(wishlistdata));

// //     // btn.classList.remove("addedtowishlist");
// //     alert("This product has been deleted from your wishlist");
// //   } else {
// //     // if ((product.rating.count) > 0) {}
// //     // btn.classList.add("addedtowishlist")
// //     _wishList.push(product);
// //     alert(`Product "${product.title}" has been added to your wishlist.`);
// //     // displayWishlistList();
// //     // localStorage.setItem("wishlist", JSON.stringify(_wishList));
// //     localStorage.setItem("currentUser", JSON.stringify(_wishList));
// //     console.log("Wishlist", _wishList);
// //   }
// // }

// async function addToWishlist(productId, btn) {
//   const currentUser =
//     (await JSON.parse(localStorage.getItem("currentUser"))) || {};
//   const wishlist = currentUser.wishList || [];

//   if (wishlist.some((item) => item.id === productId)) {
//     wishListUpdated(wishlist, productId, btn);
//   } else {
//     wishListUpdated(wishlist, productId, btn);
//   }
// }

// async function wishListUpdated(_wishList, _productId, btn) {
//   let product = await getProduct.find((product) => product.id === _productId);
//   const currentUsers = JSON.parse(localStorage.getItem("currentUser"));

//   if (_wishList.some((item) => item.id === _productId)) {
//     // Remove product from wishlist
//     _wishList = _wishList.filter((item) => item.id !== _productId);
//     btn.classList.remove("addedtowishlist");
//     alert("This product has been deleted from your wishlist");
//   } else {
//     // Add product to wishlist
//     _wishList.push(product);
//     btn.classList.add("addedtowishlist");
//     alert(`Product "${product.title}" has been added to your wishlist.`);
//   }

//   // Update currentUser wishlist
//   currentUsers.wishList = _wishList;
//   localStorage.setItem("currentUser", JSON.stringify(currentUsers));
// }

// async function wishListBtnStates(_wishListBtn, _data, userId) {
//   const wishlistBtnStateKey = `wishlist-btn-state-${userId}`;
//   let btnStateObj = {};

//   const storedState = localStorage.getItem(wishlistBtnStateKey);
//   if (storedState) {
//     btnStateObj = JSON.parse(storedState);
//   }
//   if (storedState.indexOf(_data.id) !== -1) {
//     if (btnStateObj[_data.id]) {
//       _wishListBtn.classList.add = "addedtowishlist ";

//       // addTofavBtn.className = "addtofav addedtowishlist "
//     } else {
//       // addTofavBtn.className = "addtofav"
//       _wishListBtn.classList.remove = "addedtowishlist";
//     }
//   }

// const currentState = _wishListBtn.classList.contains("addedtowishlist");

// Toggle the class
// _wishListBtn.classList.toggle("addedtowishlist");

// Update local storage
// btnStateObj[_data.id] = !currentState;

// const updatedBtnState = JSON.stringify(btnStateObj);
// localStorage.setItem(wishlistBtnStateKey, updatedBtnState);
// }

// function wishListBtnStates(_wishListBtn, _data, userId) {
//   const wishlistBtnStateKey = `wishlist-btn-state-${userId}`;
//   let btnStateObj = {};

//   const storedState = localStorage.getItem(wishlistBtnStateKey);
//   if (storedState) {
//     btnStateObj = JSON.parse(storedState);
//   }

//   const currentState = _wishListBtn.classList.contains("addedtowishlist");

//   // Toggle the class
//   _wishListBtn.classList.toggle("addedtowishlist");

//   // Update local storage
//   btnStateObj[_data.id] =!currentState;

//   const updatedBtnState = JSON.stringify(btnStateObj);
//   localStorage.setItem(wishlistBtnStateKey, updatedBtnState);
// }

// async function wishListBtnStates(_wishListBtn, _data) {
//   const wishlistBtnState = localStorage.getItem("wishlist-btn-state") || [];
//   let btnStateObj = {};

//   // if (wishlistBtnState) {
//   //   btnStateObj = await JSON.parse(wishlistBtnState);
//   // }
//   // if (wishlistBtnState.indexOf(_data.id) !== -1) {
//   //   if (btnStateObj[_data.id]) {
//   //     _wishListBtn.classList.add = "addedtowishlist ";

//   //     // addTofavBtn.className = "addtofav addedtowishlist "
//   //   } else {
//   //     // addTofavBtn.className = "addtofav"
//   //     _wishListBtn.classList.remove = "addedtowishlist";
//   //   }
//   // }
//   const currentState = _wishListBtn.classList.contains("addedtowishlist");

//   // Toggle the class
//   _wishListBtn.classList.toggle("addedtowishlist");

//   // Update local storage
//   if (wishlistBtnState) {
//     btnStateObj = await JSON.parse(wishlistBtnState);
//   }

//   btnStateObj[_data.id] = !currentState;
//   console.log(currentState);

//   const updatedBtnState = JSON.stringify(btnStateObj);
//   localStorage.setItem("wishlist-btn-state", updatedBtnState);
// }

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

// function preventIfNotLogin(e) {
//   e.preventDefault();
//   window.location.href = "../login.html";
// }
// if (!currentUsers) {
//   let preventIfLogOut = document.getElementsByClassName("preventIfLogOut");
//   for (let i = 0; i < preventIfLogOut.length; i++) {
//     preventIfLogOut[i].addEventListener("click", preventIfNotLogin);
//   }
// }
