document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");

  const sections = {
    dashboard: `<h2>Dashboard</h2><p>Welcome to the Seller Dashboard!</p>`,
    products: `
      <h2>All Products</h2>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Product A</td>
            <td>$10.00</td>
            <td>Edit</td>
            <td>X</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Product B</td>
            <td>$20.00</td>
            <td>Edit</td>
            <td>X</td>
          </tr>
        </tbody>
      </table>
    `,
    orders: `
      <h2>All Orders</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Mobile number</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1001</td>
            <td>Mahmoud</td>
            <td>01234567891</td>
            <td>$30.00</td>
          </tr>
          <tr>
            <td>1002</td>
            <td>Ahmed</td>
             <td>01234567891</td>
            <td>$50.00</td>
          </tr>
        </tbody>
      </table>
    `,
  };

  function displayContent(section) {
    contentDiv.innerHTML = sections[section];
  }

  function setActiveButton(activeButtonId) {
    const buttons = document.querySelectorAll(".left button");
    buttons.forEach((button) => {
      button.classList.remove("active");
    });
    document.getElementById(activeButtonId).classList.add("active");
  }

  document
    .getElementById("dashboard-btn")
    .addEventListener("click", function () {
      displayContent("dashboard");
      setActiveButton("dashboard-btn");
    });

  document
    .getElementById("products-btn")
    .addEventListener("click", function () {
      displayContent("products");
      setActiveButton("products-btn");
    });

  document.getElementById("orders-btn").addEventListener("click", function () {
    displayContent("orders");
    setActiveButton("orders-btn");
  });

  // Display dashboard content by default
  displayContent("dashboard");
});
