// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

// 2. 
function createFeatures(earthquakeData) {

  console.log(earthquakeData)

  //create a function that will pass info on each pin
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3>
                     <hr> Magnitude: ${feature.properties.mag}</hr>
                      Depth:  ${feature.geometry.coordinates[2]} km`
                
    )
    console.log(feature.geometry.coordinates[2])
  }

    function alterColor(features) {

    }

    function geojsonMarkerOptions(feature) {
      return {
          radius: feature.properties.mag * 3 ,
          fillColor: alterColor(feature.geometry.coordinates[2]),
          color: "rgba(0, 0, 0, 1)",
          weight: 1,
          opacity: 1,
          fillOpacity:3,
      }
    };

      //finish filling in values for this function so that we can then pass it through above in the fillColor
      //key value with alterColor(feature.geometry.coordinates[2]). Figure out numbers to incriment color change,
      //then inside quotes goes our colors. Use this link for colors: https://hihayk.github.io/scale/#3/3/50/80/-51/67/20/14/1D9A6C/29/154/108/white
        function alterColor(depth) {
        return  depth > 30 ?'#184A3A':
                depth > 15 ?'#2F8686':
                depth > 10 ?'#4997C3':
                depth > 0  ?'#8FE8FF':
                            '#BDFFF3';
    }

  // Save the earthquake data in a variable.
  //default of L.geoJSON is creating the pins for our locations
  let earthquakes = L.geoJSON(earthquakeData, {
    style: geojsonMarkerOptions,

      pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
  
  
    },


    onEachFeature: onEachFeature

  })

  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);

}


// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Creat an overlays object.
  var overlayMaps= {
    Earthquakes: earthquakes
  }

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var Danielmap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  //color for first increment that is part of string in line 126.
  function Colorlegend(i) {
    if (i==0)
    return '#BDFFF3';
    
    else if (i==1) 
    return '#8FE8FF';
    
    else if (i==2)
    return '#4997C3';

    else if (i==3)
    return '#2F8686';

    else 
    return '#184A3A';
  }

  //Compare this code with how it looked in Day 2:Activity 4 from WEEK 15
  var legend = L.control({position: 'bottomright'});


    legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        depth_increments = ['-10-2',
                             '2-10',
                             '10-15',
                             '15-30',
                             '30+'], //this is an array from our geojson. create different
        
        //Above, we passed through a java rounding function. .map works on an array and returns and array.
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    // for (var i = 0; i < depth_increments.length; i++) {
    //     div.innerHTML +=
    //         '<i style="background:' + Colorlegend(i) + '"></i> ' +
    //         depth_increments[i] + (depth_increments[i + 1] ? '&ndash;' + Colorlegend(i) + '<br>' : '+');
    // }

        for (let i=0; i < depth_increments.length; i++) {
          labels.push( 
              '<i class="square" style="background:' + Colorlegend(i) + '"></i>'+ depth_increments[i] + '')
      }
      div.innerHTML = labels.join('<br>');



    return div;
};

legend.addTo(Danielmap)
 
  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(Danielmap);

}
