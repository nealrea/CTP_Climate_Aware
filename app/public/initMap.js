var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = 2006 + Number(slider.value);

var baseLayerNoReg = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 5,
  ext: 'png'
});

var baseLayerYesReg = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 5,
  ext: 'png'
});

var cfgNoReg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 3.5,
  "maxOpacity": .5,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lon',
  // which field name in your data represents the data value - default "value"
  valueField: 'value'
};

var cfgYesReg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 3.5,
  "maxOpacity": .5,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lon',
  // which field name in your data represents the data value - default "value"
  valueField: 'value'
};

var heatmapLayerNoReg = new HeatmapOverlay(cfgNoReg);
var heatmapLayerYesReg = new HeatmapOverlay(cfgYesReg);

var mymapNoReg = new L.Map('mapid1', {
  center: new L.LatLng(0, 0),
  zoom: 1,
  layers: [baseLayerNoReg, heatmapLayerNoReg]
});

var mymapYesReg = new L.Map('mapid2', {
  center: new L.LatLng(0, 0),
  zoom: 1,
  layers: [baseLayerYesReg, heatmapLayerYesReg]
});

mymapNoReg.sync(mymapYesReg);
mymapYesReg.sync(mymapNoReg);

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json();
}

function fetchData() {
  var year = 2006 + Number(slider.value);
  var diagnostic = "tas"; //TODO: link this value to toggle button (temp/precip)
  output.innerHTML = year;
  fetch('/map', {
    method: 'POST',
    body: JSON.stringify({diagnostic: diagnostic, regMode: 'without-regulations', year: year}),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).then(data => {

    //console.log(data.max);

    heatmapLayerNoReg.setData(data);
    mymapNoReg.setView([
      0, 0
    ], 1, {
      layers: [baseLayerNoReg, heatmapLayerNoReg]
    });

    // Add dynamic URL hash for Leaflet map
    var allMapLayers = {'base_layer_name': baseLayerNoReg,
                        'overlay_name': heatmapLayerNoReg};
    var hash = new L.Hash(mymapNoReg, allMapLayers);

    //display tooltip
    var displayVal = function(data, map, diagnostic) {
      for (var i = 0; i < data.data.length; ++i) {
        if(diagnostic === "tas"){
          var circle = L.circle([
            data.data[i].lat,
            data.data[i].lon
          ], {
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: data.data[i].value
          }).setRadius(500000).bindTooltip(data.data[i].value.toFixed(1) + ' ' + '&#8451').addTo(map);
        }else{
          var circle = L.circle([
            data.data[i].lat,
            data.data[i].lon
          ], {
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: data.data[i].value
          }).setRadius(500000).bindTooltip(data.data[i].value.toFixed(7) + ' mm').addTo(map);
        }
      }
    };
    
    displayVal(data, mymapNoReg, diagnostic);

  }).catch(err => {
    console.log(err);
  });
  fetch('/map', {
    method: 'POST',
    body: JSON.stringify({diagnostic: diagnostic, regMode: 'with-regulations', year: year}),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).then(data => {

    //console.log(data.max);

    heatmapLayerYesReg.setData(data);
    mymapYesReg.setView([
      0, 0
    ], 1, {
      layers: [baseLayerYesReg, heatmapLayerYesReg]
    });
/*
    // Add dynamic URL hash for Leaflet map
    var allMapLayers = {'base_layer_name': baseLayerYesReg,
                        'overlay_name': heatmapLayerYesReg};
    var hash = new L.Hash(mymapYesReg, allMapLayers);
*/
    //display tooltip
    var displayVal = function(data, map, diagnostic) {
      for (var i = 0; i < data.data.length; ++i) {
        if(diagnostic === "tas"){
          var circle = L.circle([
            data.data[i].lat,
            data.data[i].lon
          ], {
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: data.data[i].value
          }).setRadius(500000).bindTooltip(data.data[i].value.toFixed(1) + ' ' + '&#8451').addTo(map);
        }else{
          var circle = L.circle([
            data.data[i].lat,
            data.data[i].lon
          ], {
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: data.data[i].value
          }).setRadius(500000).bindTooltip(data.data[i].value.toFixed(7) + ' mm').addTo(map);
        }
      }
    };
    
    displayVal(data, mymapYesReg, diagnostic);

  }).catch(err => {
    console.log(err);
  });
}
fetchData();
slider.onchange = fetchData;
