import { currentUser, showToastUser } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  // Displaying current user
  currentUser();
  // Fetch user data and wishlist items from localStorage
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let userWishList = user.wishList || [];
  let products = JSON.parse(localStorage.getItem("products"));

  // Function to render wishlist items
  function renderWishlistItems() {
    const wishlistContainer = document.getElementById("wishlist-items");
    wishlistContainer.innerHTML = ""; // Clear existing content

    if (userWishList.length === 0) {
      wishlistContainer.innerHTML = "<p>No items in your wishlist.</p>";
    } else {
      userWishList.forEach((productId) => {
        console.log("Checking product ID:", productId);
        let product = products.find(
          (p) => p.id.toString() === productId.toString()
        );
        console.log("Found product:", product);
        if (product) {
          wishlistContainer.innerHTML += `
            <li class="whislist__list list-group-item d-flex align-items-center">
              <img src="${product.image[0]}" alt="${product.title}" class="me-3" style="max-width: 50px;">
              <a href="productdetalis.html?id=${product.id}">${product.title}</a>
              <button type="button" class="btn btn-danger btn-sm ms-auto remove-item-btn" data-product-id="${product.id}">Remove</button>
            </li>
          `;
        } else {
          console.log(`Product with ID ${productId} not found`);
        }
      });

      // Add event listener for remove buttons
      const removeButtons =
        wishlistContainer.querySelectorAll(".remove-item-btn");
      removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productId = button.getAttribute("data-product-id");
          console.log("Removing product with ID:", productId);

          // Remove from wishlist and update localStorage
          removeFromWishlist(productId);
        });
      });
    }
  }

  // Function to remove item from wishlist
  function removeFromWishlist(productId) {
    console.log("Wishlist before removal:", user.wishList);
    const wishlistIndex = user.wishList.findIndex(
      (id) => id.toString() === productId.toString()
    );
    if (wishlistIndex > -1) {
      user.wishList.splice(wishlistIndex, 1);
      console.log("Updated wishlist:", user.wishList);
      // Update localStorage with the updated userWishList
      localStorage.setItem("currentUser", JSON.stringify(user));
      // Re-render wishlist items
      renderWishlistItems();
    } else {
      console.log(`Product ID ${productId} not found in wishlist`);
    }
  }

  // Initial render of wishlist items
  renderWishlistItems();
});
