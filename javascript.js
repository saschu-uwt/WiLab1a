//Base maps as layers for day and night viewing
var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FzY2h1IiwiYSI6ImNrazAwZXVoMjA5cHgyb255Ym1naDBqc28ifQ.v3ewKkKtOu2tK4aDwCjIiA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FzY2h1IiwiYSI6ImNrazAwZXVoMjA5cHgyb255Ym1naDBqc28ifQ.v3ewKkKtOu2tK4aDwCjIiA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var map = L.map('map', {layers:[light]}).fitWorld();//Loads the light base map as default

//Toggle between light and dark base maps
var baseMaps = {
  "Light": light,
  "Dark": dark
};

L.control.layers(baseMaps).addTo(map);



// Geolocation
function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

      //this adds a circle to the map centered at the lat and long returned by the locate function. Its radius is set to the var radius defined above.
      if (radius <= 100) {
          L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
      }
      else {
          L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
      }

      //this creates variables and adjusts the base map to reflect whether it is day or night while viewing
      var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
      var sunrise = times.sunrise.getHours();
      var sunset = times.sunset.getHours();

      var currentTime = new Date().getHours();
        if (sunrise < currentTime && currentTime < sunset){
          map.removeLayer(dark);
          map.addLayer(light);
        }
        else {
          map.removeLayer(light);
          map.addLayer(dark);
        }
}

map.on('locationfound', onLocationFound); //this is the event listener

function onLocationError(e) {
  alert(e.message);
}
map.on('locationerror', onLocationError); // In case of location error

// var helloPopup = L.popup().setContent('Hello World!');
var stateChangingButton = L.easyButton({
    states: [{
            stateName: 'zoom-to-location',// name the state
            icon:      'w3-xlarge w3-spin fa fa-crosshairs',        // and define its properties
            title:     'zoom to your location',// like its title
            onClick: function(btn, map) { // and its callback
                map.locate({setView: true, maxZoom: 16});
                // map.setView([46.25,-121.8],10);
                // btn.state('zoom-to-school');// change state on click!
            }
    }]
});

stateChangingButton.addTo(map);

// map.locate({setView: true, maxZoom: 16}); //This zooms in to our location. It comes after the marker functions
