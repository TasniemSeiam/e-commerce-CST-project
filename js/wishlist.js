<<<<<<< HEAD
function removeProductFromWishlist(e) {
  console.log(e.target.parentElement.parentElement);
  console.log(e.target.parentElement.parentElement.getAttribute("data-trId"));
  let trId = e.target.parentElement.parentElement.getAttribute("data-trId");
  let tr = e.target.parentElement.parentElement;
  if (confirm("Are you sure you want to remove")) {
    tr.parentNode.removeChild(tr);
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
    let wishlistItemsData = currentUser.wishList;
    wishlistItemsData = wishlistItemsData.filter(
      (item) => item.id.toString() !== trId.toString()
    );
    console.log(wishlistItemsData);
    currentUser.wishList = wishlistItemsData;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

let wishlistItems = document.getElementById("wishlistItems");
=======
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

>>>>>>> 93648ea726f10c0ffa7276d825fc5a12dd63d301
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
      let imageSrc =
        item.image && item.image[0] ? item.image[0] : "default-image-path"; // Replace 'default-image-path' with a default image path if needed
      items += `
<<<<<<< HEAD
                  <tr data-trId=${item.id} >
                      <td>
                          <div class='imgs'>
                              <img src=${imageSrc} alt=${item.title} class="img-fluid" />
                          </div>
                      </td>
                      <td>${item.title}</td>
                      <td class='fw-bold'>$${item.price}</td>
                      <td>
                          <span class="remove-btn p-3 deletProduct fa-solid fa-trash" onClick="removeProductFromWishlist(event)"></span>
                          <span class="cart-btn p-3 fa-solid fa-plus" onClick="addToCart()"></span>
                      </td>
                  </tr>
              `;
=======
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
>>>>>>> 93648ea726f10c0ffa7276d825fc5a12dd63d301
    });
    wishlistItems.innerHTML = items;
  } else {
    wishlistItems.innerHTML = `<tr><td colspan="6" class="text-center">Wishlist is empty</td></tr>`;
  }
}

<<<<<<< HEAD
getWishlistItems();
=======
document.addEventListener("DOMContentLoaded", () => {
  getWishlistItems();
});

window.removeProductFromWishlist = removeProductFromWishlist;
window.addToCart = addToCart;
>>>>>>> 93648ea726f10c0ffa7276d825fc5a12dd63d301
