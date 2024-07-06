// let wrapperDiv = document.querySelector(".wrapperDiv");
// // const filteredProductsContainer = document.querySelector('.test');
// const filteredProducts = JSON.parse(localStorage.getItem('filteredProducts'));
// const getProduct = JSON.parse(localStorage.getItem("products"));

// if (filteredProducts) {
//     displayProduct(filteredProducts)

// } else {
//         displayProduct(getProduct)
// }


const wrapperDiv = document.querySelector('.wrapperDiv');
let searchBTN = document.querySelector(".searchBTN")
const urlParams = new URLSearchParams(window.location.search);
const filterText = urlParams.get('filter');

const products = JSON.parse(localStorage.getItem('products'));
let categoriesarr = [];
let selsectSearch = document.querySelector(".selsectSearch");
let searchInput = document.querySelector(".searchInput");
// addEventListener("load", function () {

getCategories(products).forEach(cat => {
  let option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  selsectSearch.appendChild(option);
  selsectSearch.addEventListener("change", function (e) {
    // loadProductByCategory(e.target.value);
    searchInput.focus();
  })
});
if (filterText) {
  const products = JSON.parse(localStorage.getItem('products'));
  const filteredProducts = products.filter((product) => {
    return product.category.toLowerCase().includes(filterText.toLowerCase());
  });
  displayProduct(filteredProducts, wrapperDiv);
} else {
  const products = JSON.parse(localStorage.getItem('products'));
  displayProduct(products, wrapperDiv);
}


///////////////// search results
searchInput.focus();

searchBTN.addEventListener('click', (e) => {
  e.preventDefault();
  const searchQuery = searchInput.value.trim();
  const selectedCategory = selsectSearch.value;
  let filteredProducts;
  wrapperDiv.innerHTML = ''; // clear previous content

  if (!selectedCategory) {

    filteredProducts = JSON.parse(localStorage.getItem('products'));
  }
  else {
    filteredProducts = products.filter((product) => {
      return product.category === selectedCategory;
    });

  }
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
    console.log(searchInput.value.trim())
    console.log(filteredProducts)
    displayProduct(filteredProducts, wrapperDiv);
  }
});
// })/////

function displayProduct(product, _location) {
  product.forEach((product) => {
    let productDiv = document.createElement("div");
    productDiv.className = "col-6 col-md-4 col-lg-3 px-2 mb-2";
    let productCard = document.createElement("div");
    productCard.className = "card text-center cardProducts";
    productCard.setAttribute("id", product.id);
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
    let wishlistBtn = document.createElement("button");
    wishlistBtn.title = "add to wishlist";
    wishlistBtn.className = "btn mx-auto mx-md-0  wishlistHeart btn-white  rounded-circle";
    wishlistBtn.innerHTML = `<i class="fas fa-heart wishlistHearti "></i>`;
    imgsDiv.appendChild(imgs);
    imgsDiv.appendChild(imgs2);
    divHeart.appendChild(imgsDiv);
    divHeart.appendChild(wishlistBtn);
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    let cardTitle = document.createElement("p");
    cardTitle.className = "card-title text-primary"
    cardTitle.textContent = product.title;
    let cardRate = document.createElement("ul")
    cardRate.className = "list-inline mb-1";
    for (let s = 0; s < 4; s++) {
      let li = document.createElement("li");
      li.className = "list-inline-item mr-1 ";
      let star = document.createElement("i");
      star.className = "fa-regular fa-star";
      star.style.color = s < Math.floor(product.rating.rate) ? "gold" : "gray";
      li.appendChild(star);
      cardRate.appendChild(li);
    }
    let cardprice = document.createElement("h6");
    cardprice.textContent = "Price: " + product.price;
    let cartBtndiv = document.createElement("div");
    cartBtndiv.className = "cartBtndiv pt-2 pt-sm-0";
    let cartBtn = document.createElement("button");
    cartBtn.textContent = "Add to Cart";
    cartBtn.className = "btn mx-auto mx-md-0 text-center btn-warning addToCart  rounded-pill";
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardRate);
    cardBody.appendChild(cardprice);
    cartBtndiv.appendChild(cartBtn);
    cardBody.appendChild(cartBtndiv);
    productCard.appendChild(divHeart);
    productCard.appendChild(cardBody);
    productDiv.appendChild(productCard);
    _location.appendChild(productDiv);
    //   filteredProductsContainer.innerHTML += cardHTML;
  });
}


function getCategories(products) {
  let keys = Object.keys(products)
  keys.forEach(key => {
    console.log(products[key].category); //categories
    if (categoriesarr.includes(products[key].category)) {

      console.log(products[key].category); //products
    } else {
      categoriesarr.push(products[key].category);
    }
  })
  console.log(categoriesarr);
  return categoriesarr;
};












