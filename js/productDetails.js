<<<<<<< HEAD
import { currentUser, toggleWishlist } from "./config.js";

=======
import { currentUser } from "./config.js";
import {  getCategories} from "./sharedHome.js";
>>>>>>> 93648ea726f10c0ffa7276d825fc5a12dd63d301
document.addEventListener("DOMContentLoaded", function () {
  currentUser();

  const productDetailsContainer = document.getElementById("productDetails");
  const printButton = document.querySelector("a[title='Print']");

  if (printButton) {
    printButton.addEventListener("click", function (event) {
      event.preventDefault();
      window.print();
    });
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
      throw new Error("Product ID not found in URL.");
    }

    let products = JSON.parse(localStorage.getItem("products"));
    if (!products) {
      throw new Error("No products found in localStorage.");
    }

    const parsedProductId = isNaN(productId) ? productId : Number(productId);
    console.log("Parsed Product ID:", parsedProductId);
    console.log("Products Array:", products);

    const product = products.find(
      (p) => p.id.toString() === parsedProductId.toString()
    );

    if (!product) {
      console.error(
        `Product element with ID ${productId} not found in products array:`,
        products
      );
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const percentDiscount = Math.floor(
      ((product.price - product.discount) / product.price) * 100
    );

    const regularProduct =
      product.rating.count <= 250 && percentDiscount
        ? `<p class="old__price">$${product.price}</p>`
        : "";
    const discountPrice =
      product.rating.count <= 250 && percentDiscount
        ? `<p class="new__price">$${product.discount}</p>`
        : `<p class="price">$${product.price}</p>`;

    const filledStars = Math.round(product.rating.rate);
    const emptyStars = 5 - filledStars;
    const starsHTML = `${'<i class="fa-solid fa-star"></i>'.repeat(
      filledStars
    )}${'<i class="fa-regular fa-star"></i>'.repeat(emptyStars)}`;

    let user = JSON.parse(localStorage.getItem("currentUser")) || {
      wishList: [],
    };
    console.log("Current User:", user);
    const isInWishlist =
      user && user.wishList.some((item) => item.id === product.id);

    productDetailsContainer.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-xxl-5 col-xl-5 col-lg-5">
            <div class="product__details-nav">
              <div class="product__details-thumb">
                <div class="img__item">
                  <div class="img__item--main">
                    <img class="main-image" src="${
                      product.image[0]
                    }" alt="main image" />
                  </div>
                  <div class="img__item--subs">
                    <img class="sub-image" src="${
                      product.image[0]
                    }" alt="sub images" />
                    <img class="sub-image" src="${
                      product.image[1]
                    }" alt="sub images" />
                    ${
                      product.image[2]
                        ? `<img class="sub-image" src="${product.image[2]}" alt="sub image" />`
                        : ""
                    }
                    ${
                      product.image[3]
                        ? `<img class="sub-image" src="${product.image[3]}" alt="sub image" />`
                        : ""
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xxl-7 col-xl-7 col-lg-7">
            <div class="product__details-wrapper">
              <div class="product__details">
                <h3 class="product__details-title">${product.title}</h3>
                <div class="product__price--detalis">
                  <span class="new">${discountPrice}</span>
                  <span class="old">${regularProduct}</span>
                </div>
                <div class="product__stock">
                  <span>Availability :</span>
                  <span>${
                    product.rating.count > 0 ? "In Stock" : "Out Of Stock"
                  }</span>
                </div>
                <div class="product__stars stars__details mb-30">
                  <span>${starsHTML}</span>
                </div>
                <div class="product__details-des mb-30">
                  <p>${product.description}</p>
                </div>
                <div class="product__details-stock ${
                  product.rating.count > 100 ? "hidden" : "displayed"
                }">
                  <h3><span>Hurry Up!</span> Only ${
                    product.rating.count
                  } products left in stock.</h3>
                  <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" data-width="100%" style="width: 100%"></div>
                  </div>
                </div>
                <div class="product__details-quantity mb-20">
                  <form action="#">
                    <div class="pro-quan-area d-lg-flex align-items-center">
                      <div class="product-quantity mr-20 mb-25"></div>
                      <div class="pro-cart-btn mb-25">
                        <button class="t-y-btn" type="submit">Add to cart</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="product__details-action">
                  <ul>
                    <li>
                      <a href="#" title="Add to Wishlist"><span class="add-to-wishlist ${
                        isInWishlist ? "wishlist-added" : ""
                      }" data-id="${
      product.id
    }"><i class="fa-solid fa-heart"></i></span></a>
                    </li>
                    <li>
                      <a href="#" title="Print" onClick="window.print()"><i class="fa-solid fa-print"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll(".add-to-wishlist").forEach((wishlistIcon) => {
      wishlistIcon.addEventListener("click", function (e) {
        e.preventDefault();
        const productId = this.getAttribute("data-id");
        const product = products.find(
          (p) => p.id.toString() === productId.toString()
        );

        if (product) {
          toggleWishlist(product);
          this.classList.toggle("wishlist-added");
        } else {
          console.error(
            `Product element with ID ${productId} not found in products array:`,
            products
          );
        }
      });
    });

    const mainImage = document.querySelector(".main-image");
    const subImages = document.querySelectorAll(".sub-image");

    subImages.forEach((img) => {
      img.addEventListener("click", () => {
        mainImage.src = img.src;
      });
    });
  } catch (error) {
    console.error("Error fetching or rendering product details:", error);
    productDetailsContainer.innerHTML =
      "<p>Error fetching product details. Please try again later.</p>";
  }
});


let selsectSearch = document.querySelector(".selsectSearch");
let searchInput = document.querySelector(".searchInput");
let getProduct = JSON.parse(localStorage.getItem("products")) || [];
getCategories(getProduct).forEach((cat) => {
  let option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  selsectSearch.appendChild(option);
  searchInput.addEventListener("focus", () => {
    window.location.href = "../productsSearch.html?";
  });
}); // search select option


let notLogIn = document.querySelectorAll(".preventIfLogOut");

notLogIn.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    let currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      e.preventDefault();
      window.location.href = "./login.html";
      return;
    }
  });
});
