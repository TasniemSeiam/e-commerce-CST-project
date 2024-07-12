let mapLocation = document.querySelector("#mapLocation .mapLoc");
let map;

addEventListener("load", () => {
  getlocation();
});

function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, errorHandeler);
  } else {
    mapLocation.innerText = "Sorry Try Again with anothor browser !";
  }
}

function getPosition(position) {
  let lat = 31.437;
  let lon = 31.6853;
  let location = new google.maps.LatLng(lat, lon);
  var specs = { zoom: 14, center: location };
  map = new google.maps.Map(mapLocation, specs);
  let marker = new google.maps.Marker({
    position: location,
    map: map,
    title: "our location",
  });
  marker.setMap(map);
  let infowindow = new google.maps.InfoWindow({
    content: "<p class='text-center text-primary px-1' >Our Main Office</p>",
  });
  marker.addListener("click", function () {
    infowindow.open(map, marker);
  });
}
function errorHandeler() {
  alert("error for loading map");
}
//////////////////////set comments//////////////////////

let displayComment = document.querySelector(".displayComment");
let userComment = document.querySelector(".userComment");
let commentInput = document.querySelector("#commentForm>div textarea");
let commentBtn = document.querySelector("#commentForm>button");
// let usersComments = [];
// localStorage.setItem("comments", JSON.stringify(usersComments));
let users = localStorage.getItem("users");
if (!users) {
  console.log("no users");
}
users = JSON.parse(users);

// let comments = JSON.parse(localStorage.getItem("comments")) || [];
let currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  console.log("No currentUser found in local storage.");
} else {
  currentUser = JSON.parse(currentUser);
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    console.error("Current user not found in users.");
    showToastAdded("Current user not found in users.", "text-bg-danger");

    // return;
  }

  let user = users[userIndex];
  let comments = user.comments || [];
  let userName = currentUser.username || [];
  let theDate = new Date();
  let dateOfComment = theDate.toLocaleDateString();
  console.log(dateOfComment);
  let _id = 1;
  commentBtn.addEventListener("click", function (e) {
    let commentValue = commentInput.value.trim();
    if (!currentUser || userName == "") {
      e.preventDefault();
      window.location.href = "./login.html";
      return;
    } else {
      if (commentValue !== "") {
        comments.push({
          id: _id,
          comment: commentValue,
          userName: userName,
          date: dateOfComment,
        });
        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));
        // console.log(comments);

        displayComment.innerHTML += `
          <div class="userComment p-3 my-1 border rounded  "id="${_id++}" >
          <div class="topOfComment d-flex justify-content-between">
                    <h6 class="text-dark">${userName}</h6>
                    <span class="fa fa-trash" ></span>
                   </div>
          <p class="text-muted">${commentValue}</p>
          <p class="text-muted text-end">${theDate.toLocaleDateString()}</p>
          </div>
          `;
        displayComment.scrollTop = displayComment.scrollHeight;
      }
    }
    // e.preventDefault();
  });
  // }

  /////get comments/////

  function getComment() {
    users.forEach((ele) => {
      ele.comments;
      if (ele.comments && ele.comments.length > 0) {
        ele.comments.forEach((comment) => {
          displayComment.innerHTML += `
          <div class="userComment p-3 my-1 border rounded "id="${comment.id}">
          <div class="topOfComment d-flex justify-content-between">
                    <h6 class="text-dark">${comment.userName}</h6>
                    <span class="fa fa-trash delecomment" ></span>
                   </div>
          <p class="text-muted">${comment.comment}</p>
          <p class="text-muted text-end">${comment.date}</p>
          </div>
          `;
        });
      }
      // console.log(ele.comments);
    });
  }

  addEventListener("DOMContentLoaded", () => {
    getComment();
    // deleCommentBtn.forEach((dele) => {
    //   console.log(dele)
    let deleCommentBtn = document.querySelectorAll(".delecomment");
    deleCommentBtn.forEach((dele) => {
      // console.log(dele)
      dele.addEventListener("click", function (e) {
        // console.log(e.target.parentElement.parentElement);
        let comment = e.target.parentElement.parentElement;
        let commentId = comment.getAttribute("id");
        let index = comments.findIndex(
          (comment) => comment.id === Number(commentId)
        );
        if (index !== -1) {
          comments.splice(index, 1);
          users[userIndex].comments = comments;
          localStorage.setItem("users", JSON.stringify(users));
          comment.remove();
        }
        // console.log(comment);
        // console.log(commentId);
      });
    });
  });

  const backToTopBtn = document.getElementById("backToTopBtn");
  window.onscroll = function () {
    scrollFunction();
  };
  function scrollFunction() {
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  }
  backToTopBtn.addEventListener("click", () => {
    document.documentElement.scrollTop = 0; // chrome scroll
    document.body.scrollTop = 0; // firefox scroll
  });
}
