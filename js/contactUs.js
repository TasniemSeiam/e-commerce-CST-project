let mapLocation = document.querySelector("#mapLocation .mapLoc");
let map;

addEventListener("load", () => {
    getlocation();
})


function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, errorHandeler);

    } else {
        mapLocation.innerText = "Sorry Try Again with anothor browser !";
    }
}

function getPosition(position) {
    let lat = 31.0378496;
    let lon =31.3720832;
    let location = new google.maps.LatLng(lat, lon); 
    var specs = { zoom: 17, center: location };
    map=new google.maps.Map(mapLocation, specs);
    let marker = new google.maps.Marker({ position: location, map: map, title: "this is your location" });
    marker.setMap(map);
    let infowindow = new google.maps.InfoWindow({
        content: "our Location"
    });
    marker.addListener("click", function() {
        infowindow.open(map, marker);
    });
    // let geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ 'location': location }, function (results, status) {
    //     if (status === 'OK') {
    //         if (results[0]) {
    //             mapLocation.innerHTML = results[0].formatted_address;
    //         } else {
    //             mapLocation.innerHTML = "No results found";
    //         }
    //     } else {
    //         mapLocation.innerHTML = "Geocoder failed due to: " + status;
    //     }
    // })

}
function errorHandeler() {
    alert('error for loading map')
}