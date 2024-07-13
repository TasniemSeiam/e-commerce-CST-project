import { currentUser } from "./config.js";
currentUser();
let currentUsers=JSON.parse(localStorage.getItem('currentUser'));
navBarCurrentUserRole();
let navs = document.querySelector(".navRightSide ul");
let rightFooter = document.querySelector(".rightFooter");

function navBarCurrentUserRole() {
  // navs.innerHTML += currentUsers.role;
  if (currentUsers.role === "user") {
    rightFooter.className += " d-block";
    navs.innerHTML+=`
                <li class="nav-item">
                  <a
                    class="nav-link preventIfLogOut"
                    aria-current="page"
                    href="myAccount.html"
                    >My Account
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link preventIfLogOut" href="wishList.html"
                    >My Wishlist</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link preventIfLogOut" href="myOrders.html"
                    >My orders</a
                  >
                </li> `
  } else {
    rightFooter.className += " d-none";
    navs.innerHTML+=`
                <li class="nav-item">
                  <a class="nav-link preventIfLogOut" href="${currentUsers.role}Panel.html"
                    >${currentUsers.role}</a
                  >
                </li> `
  }
}
