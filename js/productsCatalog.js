import { currentUser, isItemInWishlist } from "./config.js";
import { addToWishlist, addToCart } from "./sharedHome.js";

document.addEventListener("DOMContentLoaded", function () {
  const productsContainer = document.getElementById("products__container");
  const checkboxContainer = document.querySelector(".categorie__select");
  const productSearch = document.querySelector("input[type='text']");
  const pagination = document.querySelector(".pagination");
  const filter = document.querySelector(".filter");
  const filterBtn = document.querySelector(".button__filter");

  let currentPage = 1;
  const productsPerPage = 12; // Number of products per page
  let filteredProducts = []; // Array to store currently filtered products
  let pageCount = 0;

  // For Displaying The Current User
  currentUser();

  filterBtn.addEventListener("click", function () {
    filter.classList.toggle("active");
  });

  try {
    // Fetch products data from localStorage
    let products = JSON.parse(localStorage.getItem("products"));
    if (!products) {
      throw new Error("No products found in localStorage.");
    }

    // Function to render products based on current page
    function renderProducts(pageNumber) {
      const startIndex = (pageNumber - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const currentProducts = filteredProducts.slice(startIndex, endIndex);

      // Retrieve the current user from localStorage
      let user = JSON.parse(localStorage.getItem("currentUser"));

      productsContainer.innerHTML = ""; // Clear existing products
      currentProducts.forEach((product) => {
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
        const starsHTML = `
          ${'<i class="fa-solid fa-star"></i>'.repeat(filledStars)}
          ${'<i class="fa-regular fa-star"></i>'.repeat(emptyStars)}
        `;

        const isWishlistItem = isItemInWishlist(product.id)
          ? "addedtowishlist"
          : "";

        const isCartAddedItem = isCartAdded(product.id)
          ? "addedtoCartlist"
          : "";

        productsContainer.innerHTML += `
          <div class="product ${
            product.rating.count === 0 ? "image__outofStock" : ""
          }" data-id="${product.id}">
            <div class="icons">
              
             <span class="  ${
               product.rating.count === 0 ? "hidden" : "displayed"
             }  cartBtn  cart"><i class="${isCartAddedItem} fa-solid fa-cart-shopping"></i></span>
              <span class="wishlistBtn add-to-wishlist ${isWishlistItem}">
                <i class="fa-solid fa-heart"></i>
              </span>
              
            </div>
            <span class="sale__percent ${
              product.rating.count > 250 ? "hidden" : "show"
            }">${percentDiscount}%</span>
            <div class="product__image">
              <img src="${product.image[0]}" alt="product" />
              <img
                class="product__image--hover"
                src="${product.image[1]}"
                alt="product"
              />
            </div>
            <h3 class="product__name"><a href="#">${product.title}</a></h3>
            <div class="product__stars">
              ${starsHTML}
            </div>
            <div class="product__price">
              ${discountPrice}
              ${regularProduct}
            </div>
          </div>
        `;
      });

      // Redirect to Product Details after clicking on a product
      document.querySelectorAll(".product").forEach((productElement) => {
        productElement.addEventListener("click", function (e) {
          const productId = this.getAttribute("data-id");
          redirectToProductDetails(productId);
        });
      });

      // To Check if items is wishlisted
      isItemInWishlist();

      function isCartAdded(productId) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          return false;
        }
        let users = JSON.parse(localStorage.getItem("users"));
        let user = users.find((user) => +user.id === +currentUser.id);
        if (!user || !Array.isArray(user.cart)) {
          return false;
        }
        return user.cart.some((item) => item.id === +productId);
      }

      // Add To WhishList EventListener
      document.querySelectorAll(".add-to-wishlist").forEach((wishlistIcon) => {
        wishlistIcon.addEventListener("click", function (e) {
          console.log("hello");
          e.stopPropagation(); // Prevent triggering the product click event
          let currentUser = localStorage.getItem("currentUser");
          if (!currentUser) {
            e.preventDefault();
            window.location.href = "./login.html";
            return;
          } else {
            let products = JSON.parse(localStorage.getItem("products"));
            let productId = this.closest(".product").getAttribute("data-id");

            addToWishlist(productId, e.target);

            // Update wishlist button appearance based on current state
            const isWishlistItem = isItemInWishlist(productId)
              ? "addedtowishlist"
              : "";
            wishlistIcon.classList.toggle("addedtowishlist", isWishlistItem);
          }
        });
      });

      // Add To WhishList EventListener
      document.querySelectorAll(".cart").forEach((cartIcon) => {
        cartIcon.addEventListener("click", function (e) {
          console.log("hello");
          e.stopPropagation(); // Prevent triggering the product click event
          let currentUser = localStorage.getItem("currentUser");
          if (!currentUser) {
            e.preventDefault();
            window.location.href = "./login.html";
            return;
          } else {
            let products = JSON.parse(localStorage.getItem("products"));
            let productId = this.closest(".product").getAttribute("data-id");

            addToCart(productId);
          }
        });
      });
    }
    function redirectToProductDetails(productId) {
      window.location.href = `productdetalis.html?id=${productId}`;
    }

    // Initial rendering of products
    filteredProducts = products; // Start with all products
    renderProducts(currentPage);

    // Function to update pagination links based on filtered products
    function updatePagination() {
      pagination.innerHTML = ""; // Clear existing pagination

      pageCount = Math.ceil(filteredProducts.length / productsPerPage);

      // Add "Previous" button
      pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <span class="page-link">Previous</span>
        </li>
      `;

      // Add page numbers
      for (let i = 1; i <= pageCount; i++) {
        pagination.innerHTML += `
          <li class="page-item ${currentPage === i ? "active" : ""}">
            <span class="page-link">${i}</span>
          </li>
        `;
      }

      // Add "Next" button
      pagination.innerHTML += `
        <li class="page-item ${currentPage === pageCount ? "disabled" : ""}">
          <span class="page-link">Next</span>
        </li>
      `;
    }

    // Initial pagination setup
    updatePagination();

    // Handle click events on pagination links
    pagination.addEventListener("click", function (e) {
      if (e.target.tagName === "SPAN" || e.target.tagName === "A") {
        const pageText = e.target.textContent;
        if (pageText === "Previous" && currentPage > 1) {
          currentPage--;
        } else if (pageText === "Next" && currentPage < pageCount) {
          currentPage++;
        } else if (!isNaN(parseInt(pageText))) {
          currentPage = parseInt(pageText);
        }

        renderProducts(currentPage);
        updatePagination();
      }
    });

    // Product Filteration
    checkboxContainer.addEventListener("change", function () {
      // Array of checked categories
      const checkedCategories = Array.from(
        checkboxContainer.querySelectorAll("input[type='checkbox']:checked")
      ).map((checkbox) => checkbox.value);

      if (checkedCategories.length > 0) {
        filteredProducts = products.filter((product) =>
          checkedCategories.includes(product.category)
        );
      } else {
        filteredProducts = products; // Show all products if no categories are checked
      }

      currentPage = 1; // Reset to first page when filtering
      renderProducts(currentPage);
      updatePagination();
    });

    // Product Search
    productSearch.addEventListener("input", function () {
      const searchTerm = productSearch.value.toLowerCase();
      filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );

      currentPage = 1; // Reset to first page when searching
      renderProducts(currentPage);
      updatePagination();
    });
  } catch (error) {
    console.error("Error fetching or rendering data:", error);
    // Handle error scenario, for example:
    productsContainer.innerHTML =
      "<p>Error fetching products. Please try again later.</p>";
  }
});

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
