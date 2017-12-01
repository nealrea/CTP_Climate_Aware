var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = 2006 + Number(slider.value);

let diagnostic = 'tas';
let zoom = 1;

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
  output.innerHTML = year;
  fetch('/map', {
    method: 'POST',
    body: JSON.stringify({diagnostic: diagnostic, year: year}),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).then(data => {

    //console.log(data.max);

    heatmapLayerNoReg.setData(data['without-regulations']);
    mymapNoReg.setView([
      0, 0
    ], zoom, {
      layers: [baseLayerNoReg, heatmapLayerNoReg]
    });

    heatmapLayerYesReg.setData(data['with-regulations']);
    mymapYesReg.setView([
      0, 0
    ], zoom, {
      layers: [baseLayerYesReg, heatmapLayerYesReg]
    });

    // social sharing
    // L.control.social({default_text: "Check out my Climate Aware map!"}).addTo(mymapNoReg);
    // Add dynamic URL hash for Leaflet map
    // var allMapLayers = {
    //   'base_layer_name': baseLayerNoReg,
    //   'overlay_name': heatmapLayerNoReg
    // };

       // var hash = new L.Hash(mymapNoReg, allMapLayers);

    //  display tooltip
    // var displayVal = function(data, map, diagnostic) {
    //   for (var i = 0; i < data["without-regulations"].data.length; ++i) {
    //     if(diagnostic === "tas"){
    //       var circle = L.circle([
    //         data["without-regulations"].data[i].lat,
    //         data["without-regulations"].data[i].lon
    //       ], {
    //         color: 'transparent',
    //         fillColor: 'transparent',
    //         fillOpacity: data["without-regulations"].data[i].value
    //       }).setRadius(500000).bindTooltip(data["without-regulations"].data[i].value.toFixed(1) + ' ' + '&#8451').addTo(map);
    //     }else{
    //       var circle = L.circle([
    //         data["without-regulations"].data[i].lat,
    //         data["without-regulations"].data[i].lon
    //       ], {
    //         color: 'transparent',
    //         fillColor: 'transparent',
    //         fillOpacity: data["without-regulations"].data[i].value
    //       }).setRadius(500000).bindTooltip(data["without-regulations"].data[i].value.toFixed(7) + ' mm').addTo(map);
    //     }
    //   }
    // };
    //
    // displayVal(data["without-regulations"], mymapNoReg, diagnostic);

  }).catch(err => {
    console.log(err);
  });


    //console.log(data.max);
    /*
    // Add dynamic URL hash for Leaflet map
    var allMapLayers = {'base_layer_name': baseLayerYesReg,
                        'overlay_name': heatmapLayerYesReg};
    var hash = new L.Hash(mymapYesReg, allMapLayers);
*/
  //  display tooltip
    // var displayVal = function(data, map, diagnostic) {
    //   for (var i = 0; i < data.data.length; ++i) {
    //     if(diagnostic === "tas"){
    //       var circle = L.circle([
    //         data.data[i].lat,
    //         data.data[i].lon
    //       ], {
    //         color: 'transparent',
    //         fillColor: 'transparent',
    //         fillOpacity: data.data[i].value
    //       }).setRadius(500000).bindTooltip(data.data[i].value.toFixed(1) + ' ' + '&#8451').addTo(map);
    //     }else{
    //       var circle = L.circle([
    //         data.data[i].lat,
    //         data.data[i].lon
    //       ], {
    //         color: 'transparent',
    //         fillColor: 'transparent',
    //         fillOpacity: data.data[i].value
    //       }).setRadius(500000).bindTooltip(data.data[i].value.toFixed(7) + ' mm').addTo(map);
    //     }
    //   }
    // };
    //
    // displayVal(data, mymapYesReg, diagnostic);
}

// Add dynamic URL hash for Leaflet map
var allMapLayers = {
   'base_layer_name': baseLayerNoReg,
   'overlay_name': heatmapLayerNoReg
 };

var hash = new L.Hash(mymapNoReg, allMapLayers);

// social sharing
L.control.social({default_text: "Check out my Climate Aware map!"}).addTo(mymapNoReg);

fetchData();
slider.onchange = fetchData;

document.querySelector('#params').onchange = function(event) {
  diagnostic = event.target.getAttribute('id');
  fetchData();
};

var timeLapseBtn = document.querySelector('#timelapse');
var stopTimerBtn = document.querySelector('#stop-time');

let i = 0;
let MAX_COUNT = 294;
let stopTimer = false;
let interval = 500;

const initSetTimeOut = (callback) => {
  setTimeout(callback, interval);
};

const setValue = (year) => {
  slider.value = year;
  fetchData();
  if (!stopTimer) initTimeLapse();
};

const initTimeLapse = () => {
  stopTimer = false;
  if(i++ < MAX_COUNT)
    initSetTimeOut(setValue.bind(null, i))
};

timeLapseBtn.onclick = function(e){
  zoom = mymapNoReg.getZoom();
  e.target.disabled = true;
  stopTimerBtn.value = "Stop";
  i = slider.value;
  initTimeLapse();
};

stopTimerBtn.onclick =function(e) {
  stopTimer = true;
  timeLapseBtn.disabled= false;
  if (e.target.value == "Reset") {
    i = 0; speed=1;
    slider.value = 0;
    e.target.value = "Stop";
    timeLapseBtn.value = "Timelapse";
    fetchData();
    return;
  }
  timeLapseBtn.value = "Resume";
  e.target.value= "Reset"
};
