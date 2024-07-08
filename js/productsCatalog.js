import { currentUser } from "./config.js";

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

        productsContainer.innerHTML += `
          <div class="product" data-id="${product.id}">
            <div class="icons">
              <span><i class="fa-solid fa-cart-shopping"></i></span>
              <span><i class="fa-solid fa-heart"></i></span>
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

      //IMPORTANT
      // Redirect to Product Details After after clicking on certain one
      document.querySelectorAll(".product").forEach((productElement) => {
        productElement.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          redirectToProductDetails(productId);
        });
      });
    }
    function redirectToProductDetails(productId) {
      window.location.href = `productdetalis.html?id=${productId}`;
    } // End OF redirection

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
