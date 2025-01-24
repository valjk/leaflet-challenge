// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with center and zoom options.
let map = L.map('map', {
  center: [37.09, -95.71],
  zoom: 5
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
      return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
      };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
      if (depth > 90) {
          return "#ea462c";
      }
      if (depth > 70) {
          return "#ea712c";
      }
      if (depth > 50) {
          return "#ee9000";
      }
      if (depth > 30) {
          return "#eec300";
      }
      if (depth > 10) {
          return "#e3ee00";
      }
      return "#73ee00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
      if (magnitude === 0) {
          return 1;
      }
      return magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
      // Turn each feature into a circleMarker on the map.
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },
      // Set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
      // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
      onEachFeature: function (feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
  }).addTo(map);
});

