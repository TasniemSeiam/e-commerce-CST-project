import { currentUser } from "./config.js";

currentUser();
document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
});
function displayOrders() {
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

  let orders = user.orders || [];

  let ordersTableBody = document.querySelector("tbody");
  let rows = "";

  orders.forEach((order) => {
    let paymentMethodDisplay =
      order.paymentMethod === "cod"
        ? "Cash on delivery"
        : "Credit / Debit Card";
//   <td>${paymentMethodDisplay}</td>
    rows += `
      <tr>
        <td class="d-none d-md-table-cell">${order.orderId}</td>
        <td class="d-none d-md-table-cell">${order.orderDate}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>
          ${order.trackingStatus}
        </td>
      </tr>
    `;
  });

  ordersTableBody.innerHTML = rows;
}
