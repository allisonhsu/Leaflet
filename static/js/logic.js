var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  // console.log(data)
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  var myMap = L.map("map", {
    center: [34.00, -118.00],
    zoom: 5
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  earthquakeData.forEach(feature => {
    var mag = feature.properties.mag;

    var color = "";
    
    if (mag <=1) {
        color = "lightgreen";
    }
    else if (mag <= 2) {
        color = "green";
    }
    else if (mag <= 3) {
        color = "yellow";
    }
    else if (mag <= 4) {
        color = "orange";
    }
    else if (mag <= 5) {
        color = "red";
    }
    else {
        color = "darkred";
    }
    var coord = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]]
    L.circle(coord, {
                fillColor: color,
                fillOpacity: 0.75,
                color: color,
                radius: mag * 10000
             }).bindPopup("<h3>Location: " + feature.properties.place +
             "</h3><hr><p>Date/Time: " + new Date(feature.properties.time) + 
             "</p><hr><p>"+"Magnitude: "+ feature.properties.mag + "</P>" ).addTo(myMap);

  })
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function () {
  
      var div = L.DomUtil.create("div", "legend");
      var labels = ["0-1","1-2","2-3","3-4","4-5",">5"];
      var colors=["lightgreen","green","yellow","orange","red","darkred"]
  
      for (var i = 0; i < colors.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + labels[i] + '<br>';
        }
    return div;
  };
  
  legend.addTo(myMap);
};

