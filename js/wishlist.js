///////// wishlist items in cart list
let wishlistItems = document.getElementById("wishlistItems");
function getWishlistItems() {
  let items = "";
  let wishlistItemsData = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlistItemsData && wishlistItemsData.length > 0) {
    wishlistItemsData.forEach((item) => {
      items += `
         <tr>
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
                <td><span class="remove-btn">&times;</span></td>
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
