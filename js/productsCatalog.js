import {
  currentUser,
  toggleWishlist,
  redirectToProductDetails,
  getProductDetailsById,
} from "./config.js";
import { addToCart } from "../js/sharedHome.js";

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

    // Retrieve the current user from localStorage
    let user = JSON.parse(localStorage.getItem("currentUser"));

    // Function to render products based on current page
    function renderProducts(pageNumber) {
      const startIndex = (pageNumber - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const currentProducts = filteredProducts.slice(startIndex, endIndex);

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

        // Check if the product is in the wishlist
        const isInWishlist =
          user && user.wishList.some((item) => item.id === product.id);

        productsContainer.innerHTML += `
          <div class="product" data-id="${product.id}">
            <div class="icons">
              <span class="add-to-cart"><i class="fa-solid fa-cart-shopping"></i></span>
              <span class="add-to-wishlist ${
                isInWishlist ? "wishlist-added" : ""
              }">
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

      // Redirect to Product Details After clicking on a certain one
      document.querySelectorAll(".product").forEach((productElement) => {
        productElement.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          redirectToProductDetails(productId);
        });
      });

      // Add event listeners to heart icons
      document.querySelectorAll(".add-to-wishlist").forEach((wishlistIcon) => {
        wishlistIcon.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent triggering the product click event
          const productId = this.closest(".product").getAttribute("data-id");

          // Find the product object by ID
          const product = products.find(
            (p) => p.id.toString() === productId.toString()
          );

          if (product) {
            toggleWishlist(product);
          } else {
            console.error(`Product with ID ${productId} not found.`);
          }
        });
      });

      // Add event listeners to cart icons
      document.querySelectorAll(".add-to-cart").forEach((cartIcon) => {
        cartIcon.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent triggering the product click event
          const productId = this.closest(".product").getAttribute("data-id");
          console.log("Adding to cart, product ID:", productId); // Debug log
          addToCart(productId);
        });
      });
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