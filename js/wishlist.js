///////// wishlist items in cart list

function removeProductFromWishlist(e) {
  console.log(e.target.parentElement.parentElement)
  console.log(e.target.parentElement.parentElement.getAttribute("data-trId"))
  let trId = e.target.parentElement.parentElement.getAttribute("data-trId");
  let tr = e.target.parentElement.parentElement;
  if (confirm("Are you sure you want to remove")) {  
    tr.parentNode.removeChild(tr);
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
    let wishlistItemsData = currentUser.wishList;
    wishlistItemsData = wishlistItemsData.filter((item) => item.id !== Number(trId));
    console.log(wishlistItemsData);
    currentUser.wishList = wishlistItemsData;
    localStorage.setItem("currentUszer", JSON.stringify(currentUser));
  }
}


let wishlistItems = document.getElementById("wishlistItems");
function getWishlistItems() {
  let items = "";
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
  let wishlistItemsData = currentUser.wishList;
  if (wishlistItemsData && wishlistItemsData.length > 0) {
    wishlistItemsData.forEach((item) => {
      items += `
         <tr data-trId=${item.id} >
                <td>
                  <div class='imgs' >
                  <img
                    src=${item.image[0]}
                    alt=${item.title}
                    class="img-fluid"
                  /></div>
                </td>
                <td>${item.title}</td>
                <td class='fw-bold' >$${item.price}</td>
                <td><span class="remove-btn p-3 deletProduct fa-solid fa-trash " onClick="removeProductFromWishlist(event)" ></span><span class="cart-btn p-3 fa-solid fa-plus " onClick="addToCart()" ></span></td>
              </tr>
      `;
    });

    wishlistItems.innerHTML = items;
  } else {
    wishlistItems.innerHTML = `<tr><td colspan="6" class="text-center">wishlist is empty</td></tr>`;
  }
  // return cartItem;
}
getWishlistItems();
