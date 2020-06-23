var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map object
var myMap = L.map("map", {
    center: [
        38.5816, -121.4944
    ],
    zoom: 5,
});

// Add tilelayer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

//   Access the geojason
d3.json(url, function(data) {
    createFeatures(data.features);
    console.log(data);
});

function colorMag(magnitude) {
// ['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#2b8cbe','#045a8d']
    // switch function here matches magnitude with color
    switch (magnitude) {
    case (magnitude < 1):
      return '#f1eef6';
    case (magnitude < 2):
      return '#d0d1e6';
    case (magnitude < 3):
      return '#a6bddb';
    case (magnitude < 4):
      return '#74a9cf';
    case (magnitude < 5):
      return '#2b8cbe';
    default:
      return '#045a8d';
    }
}


// Define createFeatures
function createFeatures(earthquakeData){
    // access the features and layers

    // Define function onEachFeature
    function onEachFeature1(feature, layer) {
        //add circles for each earthquake - on each feature
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: "white",
          weight: 1,
          fillColor: colorMag(feature.properties.mag),
          fillOpacity: 0.5,
          radius: feature.properties.mag * 10000
        })
        .bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
        .addTo(myMap);
    }
    
        //In this process, you also need to bind a popup
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature1
    });
}

// // Create Legend

// // Change all the code below to work with magnitude
// // https://leafletjs.com/examples/choropleth/
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
    // insert the magnitudes below
        //mag = [0.5, 1.5, 2.5, 3.5, 4.5, 5]
        labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
        colors = [' #f1eef6',' #d0d1e6',' #a6bddb',' #74a9cf',' #2b8cbe',' #045a8d']

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style = "background:' + colors[i] + '"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

// add earthquake layer to map
legend.addTo(myMap);




