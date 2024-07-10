import { addToCart } from "./sharedHome.js";

let wishlistItems = document.getElementById("wishlistItems");

function removeProductFromWishlist(e) {
  let trId = e.target.parentElement.parentElement.getAttribute("data-trId");
  let tr = e.target.parentElement.parentElement;
  if (confirm("Are you sure you want to remove this product from the wishlist?")) {
    tr.parentNode.removeChild(tr);
    let users = localStorage.getItem("users");
    let currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      console.error("No currentUser found in local storage.");
      return;
    }

    if (!users) {
      console.error("No users found in local storage.");
      return;
    }

    currentUser = JSON.parse(currentUser);
    users = JSON.parse(users);
    const userIndex = users.findIndex((user) => user.id === currentUser.id);

    if (userIndex === -1) {
      console.error("Current user not found in users.");
      return;
    }

    let user = users[userIndex];
    let wishlistItemsData = user.wishList || [];
    wishlistItemsData = wishlistItemsData.filter((item) => item.id !== Number(trId));
    user.wishList = wishlistItemsData;

    users[userIndex] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function getWishlistItems() {
  let users = localStorage.getItem("users");
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.error("No currentUser found in local storage.");
    return;
  }

  if (!users) {
    console.error("No users found in local storage.");
    return;
  }

  currentUser = JSON.parse(currentUser);
  users = JSON.parse(users);
  const user = users.find((user) => user.id === currentUser.id);

  if (!user) {
    console.error("Current user not found in users.");
    return;
  }

  let items = "";
  let wishlistItemsData = user.wishList || [];
  if (wishlistItemsData && wishlistItemsData.length > 0) {
    wishlistItemsData.forEach((item) => {
      items += `
        <tr data-trId=${item.id}>
          <td>
            <div class='imgs'>
              <img src=${item.image[0]} alt=${item.title} class="img-fluid"/>
            </div>
          </td>
          <td>${item.title}</td>
          <td class='fw-bold'>$${item.price}</td>
          <td>
            <span class="remove-btn p-3 deletProduct fa-solid fa-trash" onClick="removeProductFromWishlist(event)"></span>
            <span class="cart-btn p-3 fa-solid fa-plus" onClick="addToCart(${item.id})"></span>
          </td>
        </tr>
      `;
    });
    wishlistItems.innerHTML = items;
  } else {
    wishlistItems.innerHTML = `<tr><td colspan="6" class="text-center">Wishlist is empty</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getWishlistItems();
});

window.removeProductFromWishlist = removeProductFromWishlist;
window.addToCart = addToCart;
