let categoriesarr = [],
    productsarr = [];
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
addEventListener("load", function () {
    try {
        loadProducts();
    } catch (e) {
        console.log("error when loading data" + e);
    }


    getCategories(getProduct).forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        selsectSearch.appendChild(option);
        searchInput.addEventListener("focus", () => {
            window.location.href = '../productsSearch.html?';
        })
    });

    getCategories(getProduct).forEach(cat => {
        // left side product of category
        let category = document.createElement("a");
        category.textContent = cat;
        category.href = "../productsSearch.html?filter=" + cat;
        category.className = "list-group-item list-group-item-action py-3 text-capitalize ";
        category.setAttribute("data-filter", cat);
        showCategories.appendChild(category);
    });// end selsectSearch categories

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
        <a href="product_details.html" class=" mt-4 btn btn-warning py-2 rounded-pill w-50">Discover Now</a>`
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
        console.log(product)
        // // best sale section
        imgright.src = getProduct[19].image[0];
        imgright1.src = getProduct[2].image[1];
        pright.innerHTML = `$${getProduct[19].price}
        ${getProduct[19].title}`;
        pright1.innerHTML = `$${getProduct[2].price}
        ${getProduct[2].title}`;
    }//caursel header

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
                })
            } else if (e.target.id == "pills-newArrival-tab") {
                nextprevBtn.forEach((nextPrev, i) => {
                    nextPrev.setAttribute("data-bs-target", "#divOFnewArrival");
                    // console.log(nextPrev.getAttribute("data-bs-target"));
                })
            } else {
                nextprevBtn.forEach((nextPrev, i) => {
                    nextPrev.setAttribute("data-bs-target", "#divOFRandom");
                })
            }
        });
    });// end every slider has its own id


    displayBigSales(0, bigSaleSection);// display the big sales
    sillingProduct();// display the sales section
    // randomproduct(getProduct,20);// display the random product
    displayBigSales(0, adv);// display the big sales
    onSale(getProduct)//display On sale section
    flashsection(getProduct);

}); // end loading
async function loadProducts() {
    getProduct = JSON.parse(localStorage.getItem("products"));
    if (!getProduct || getProduct.length == 0) {
        products = await fetch("../data/products.json");
        getProduct = await products.json();
        localdata = JSON.stringify(getProduct);
        localStorage.setItem("products", localdata);
        console.log(localdata);
        return getProduct;
    } else {
        console.log(getProduct);
        return getProduct;
    }
}
// function getProducts(_products) {
//     let keys = Object.keys(_products)
//     keys.forEach(key => {

//         productsarr.push(_products[key])
//         console.log(_products[key]); //products
//     })
//     console.log(keys);
//     console.log(productsarr);
//     return productsarr;
//     // let categories= 
// }
function getCategories(getProduct) {
    let keys = Object.keys(getProduct)
    keys.forEach(key => {
        console.log(getProduct[key].category); //categories
        if (categoriesarr.includes(getProduct[key].category)) {

            console.log(getProduct[key].category); //products
        } else {
            categoriesarr.push(getProduct[key].category);
        }
    })
    console.log(categoriesarr);
    return categoriesarr;
};

function getBigSales(getProduct) {
    let bigSales = getProduct.filter(product => {
        return product.rating.count < 150;
    });
    return bigSales;
}//return array of product's count < 150 

function randomproduct(getProduct, num) {
    let numRandomProducts = num; // number of random products to select

    let randomProducts = [];
    while (randomProducts.length < numRandomProducts) {
        const randomIndex = Math.floor(Math.random() * getProduct.length);
        randomProducts.push(getProduct.splice(randomIndex, 1)[0]);
    }
    console.log(randomProducts); // array of random products
    return randomProducts; // array of random products
}


function displayBigSales(x, sect) {
    let bigSale = getBigSales(getProduct);// big sales array products < 150
    console.log(bigSale);
    for (let i = x; i < x + 3; i++) {
        let bigsaleDivwrapper = document.createElement("div");
        bigsaleDivwrapper.className = "discounts col-12 col-md-4 mb-3";
        let bigsaleDiv = document.createElement("div");
        bigsaleDiv.className = " position-relative overflow-hidden rounded rounded-3 p-2 bg-white h-100";
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
              <a href="product_details.html" class="text-decoration-underline text-white ">Discover Now</a>`
        bigsaleDiv.appendChild(img);
        bigsaleDiv.appendChild(upperProductDis);
        bigsaleDiv.appendChild(forntDiv);
        bigsaleDiv.appendChild(fornthDiv);
        bigsaleDiv.appendChild(frontdark);
        bigsaleDivwrapper.appendChild(bigsaleDiv);
        sect.appendChild(bigsaleDivwrapper);
    }
}// end big sale section


function sillingProduct() {
    let carouselItemDiv1 = document.querySelectorAll(".divOFbestselleng .divOFbestsellengProduct1 .carousel-item .row")[0];
    for (let i = 0; i < 5; i++) {
        let items = getProduct[i];
        displayProduct(items, carouselItemDiv1);
    }
    let carouselItemDiv2 = document.querySelectorAll(".divOFbestselleng .divOFbestsellengProduct1 .carousel-item .row")[1];
    for (let i = 5; i < 10; i++) {
        let items = getProduct[i];
        displayProduct(items, carouselItemDiv2);
    }
    let carouselItemnewArrival1 = document.querySelectorAll(".divOFnewArrival .divOFbestsellengnewArrival .carousel-item .row")[0];
    let numOfLength = (getProduct.length) - 1
    for (let i = numOfLength; i > (numOfLength - 5); i--) {
        let items = getProduct[i];
        displayProduct(items, carouselItemnewArrival1);
    }
    let carouselItemnewArrival2 = document.querySelectorAll(".divOFnewArrival .divOFbestsellengnewArrival .carousel-item .row")[1];
    for (let i = numOfLength - 5; i > (numOfLength - 10); i--) {
        let items = getProduct[i];
        displayProduct(items, carouselItemnewArrival2);
    }
    // let carouselItemRandom1 = document.querySelectorAll(".divOFRandom .divOFbestsellengrandom .carousel-item .row")[0];
    // let randomItems = randomproduct(getProduct, 20);
    // for (let i = 0; i < 5; i++) {
    //     let items = randomItems[i];
    //     // let product = getProduct[i];
    //     console.log(items);
    //     displayProduct(items, carouselItemRandom1);
    // }
    // let carouselItemRandom2 = document.querySelectorAll(".divOFRandom .divOFbestsellengrandom .carousel-item .row")[1];
    // for (let i = 5; i < 10; i++) {
    //     let items = randomItems[i];
    //     // let product = getProduct[i];
    //     console.log(items);
    //     displayProduct(items, carouselItemRandom2);
    // }

}

function displayProduct(product, _location) {
    let productDiv = document.createElement("div");
    productDiv.className = "col-6 col-md-4 col-lg px-2 mb-2";
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
    // cartBtn.addEventListener("click", function () {
    //     addToCart(product);
    // });
    // wishlistBtn.addEventListener("click", function () {
    //     addToWishlist(product);
    // });
    // $(cardBody).hover(function () { 
    //     $(imgs).addClass("d-none");
    //     $(imgs2).removeClass("d-none").css("animation"," imganimatehide 1s  ");
    //     // $(imgs2).removeClass("d-none").fadeIn(2000);
    // }, function () {
    //     $(imgs2).addClass("d-none");
    //     $(imgs).removeClass("d-none").css("animation"," imganimatehide 1s reverse");

    // })
    return _location;
}

function onSale(products) {
    let onSalediv = document.querySelector('#onSale div .row');
    for (let i = 0; i < 6; i++) {
        let product = products[i];
        let onsalecol = document.createElement("div");
        onsalecol.className = "col-6 col-lg-4  cardOnsale";
        let cardDiv = document.createElement("div");
        cardDiv.className = "card mb-3 p-2 py-3";
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
        cardprice.innerHTML = `price: ${product.discount}$ <span
             class="text-muted text-decoration-line-through ms-4">${product.price}$</span>`
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardRate);
        cardBody.appendChild(cardprice);
        divs2.appendChild(cardBody);
        rowdiv.appendChild(divs);
        rowdiv.appendChild(divs2);
        cardDiv.appendChild(rowdiv);

        onsalecol.appendChild(cardDiv);

        onSalediv.appendChild(onsalecol);
    }
}

function colorActived(ele) {
    ele.addEventListener('click', function (e) {
        $(e.target).addClass("text-warning");
        $(e.target).parent().siblings().children().removeClass("text-warning");
    })
} // active btn

function flashsection(products) {
    getCategories(products).forEach((cat, i) => {
        let catWithoutSpace = cat.split(" ");
        let catWithoutSpaceStr = catWithoutSpace.join("");
        catWithoutSpaceStr = catWithoutSpaceStr.split("'");
        catWithoutSpaceStr = catWithoutSpaceStr.join("");

        console.log(catWithoutSpace);
        console.log(catWithoutSpaceStr);
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
        tabPane1FlashSeller.setAttribute("aria-labelledby", `pills-${catWithoutSpaceStr}-tab`);

        let divRow = document.createElement("div");
        divRow.className = "row";
        // let t = "men's clothing";
        // button1.addEventListener("click", function (e) {
        //     t=e.target.textContent
        //     filteredProductsByCategory(products,t,divRow)
        // });
        let t = tabPane1FlashSeller.getAttribute("id")
        let f = button1.getAttribute("data-bs-target")
        if (("#" + t) == f) {
            filteredProductsByCategory(products, cat, divRow)
        }
        tabPane1FlashSeller.appendChild(divRow);
        tabContent2.appendChild(tabPane1FlashSeller);
    })

}




function filteredProductsByCategory(products, _textcontent, _locAppendto) {
    _locAppendto.innerHTML = "";
    let filterProducts = products.filter(product => product.category == _textcontent);
    // console.log(_textcontent.textContent)
    filterProducts.forEach(filterProduct => {
        displayProduct(filterProduct, _locAppendto);
    });
}
const backToTopBtn = document.getElementById('backToTopBtn');

// Show button when user scrolls down
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

// Smooth scroll to top
backToTopBtn.addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
});
