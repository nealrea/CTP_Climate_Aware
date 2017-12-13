var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = 2006 + Number(slider.value);

let diagnostic = 'tas';
let zoom = 1;
let center;
let seaLevelRiseNoReg = 0;
let seaLevelRiseYesReg = 0;

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
    center = mymapYesReg.getCenter(); 
    zoom = mymapYesReg.getZoom();

    heatmapLayerNoReg.setData(data['without-regulations']);
    mymapNoReg.setView(
      center, 
      zoom, {
      layers: [baseLayerNoReg, heatmapLayerNoReg]
    });

    heatmapLayerYesReg.setData(data['with-regulations']);
    mymapYesReg.setView(
      center, 
      zoom, {
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

function climateEffect(seaLevelRiseNoReg, seaLevelRiseYesReg){
  var year = 2006 + Number(slider.value);
  if(seaLevelRiseNoReg < 3){
    document.getElementById("noRegText").innerHTML = "NYC Status: Normal";
    document.getElementById("noRegText").style.background = "#46FE01";
  }else if(seaLevelRiseNoReg < 5){
    document.getElementById("noRegText").innerHTML = "NYC Status: Westside Highway underwater";
    document.getElementById("noRegText").style.background = "#FDF902";
  }else if(seaLevelRiseNoReg < 15){
    document.getElementById("noRegText").innerHTML = "NYC Status: Everything south of Canal street is an island";
    document.getElementById("noRegText").style.background = "#FEB901";
  }else{
    document.getElementById("noRegText").innerHTML = "NYC Status: Sea water surrounds pools at 9/11 memorial";
    document.getElementById("noRegText").style.background = "#FE0101";
  }

  if(seaLevelRiseYesReg < 3){
    document.getElementById("yesRegText").innerHTML = "NYC Status: Normal";
    document.getElementById("yesRegText").style.background = "#46FE01";
  }else if(seaLevelRiseYesReg < 5){
    document.getElementById("yesRegText").innerHTML = "NYC Status: Westside Highway underwater";
    document.getElementById("yesRegText").style.background = "#FDF902";
  }else if(seaLevelRiseYesReg < 15){
    document.getElementById("yesRegText").innerHTML = "NYC Status: Everything south of Canal street is an island";
    document.getElementById("yesRegText").style.background = "#FEB901";
  }else{
    document.getElementById("yesRegText").innerHTML = "NYC Status: Sea water surrounds pools at 9/11 memorial";
    document.getElementById("yesRegText").style.background = "#FE0101";
  }
};

function seaLevel(){
  seaLevelRiseNoReg = Number(slider.value) * 0.05278357; //RCP 8.5
  seaLevelRiseNoReg = Math.round(seaLevelRiseNoReg*100) / 100
  document.getElementById("seaLevelNoReg").innerHTML = "Sea-level rise: " + String(seaLevelRiseNoReg) + "ft";

  seaLevelRiseYesReg = Number(slider.value) * 0.01138251; //RCP 2.6
  seaLevelRiseYesReg = Math.round(seaLevelRiseYesReg*100) / 100
  document.getElementById("seaLevelYesReg").innerHTML = "Sea-level rise: " + String(seaLevelRiseYesReg) + "ft";
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
seaLevel();
climateEffect(seaLevelRiseNoReg, seaLevelRiseYesReg);
slider.onchange = function(){
  fetchData();
  seaLevel();
  climateEffect(seaLevelRiseNoReg, seaLevelRiseYesReg);
};

document.querySelector('#params').onchange = function(event) {
  diagnostic = event.target.getAttribute('id');
  fetchData();
  seaLevel();
  climateEffect(seaLevelRiseNoReg, seaLevelRiseYesReg);
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
  seaLevel();
  climateEffect(seaLevelRiseNoReg, seaLevelRiseYesReg);
  if (!stopTimer) initTimeLapse();
};

const initTimeLapse = () => {
  stopTimer = false;
  if(i++ < MAX_COUNT)
    initSetTimeOut(setValue.bind(null, i))
};

timeLapseBtn.onclick = function(e){
  //zoom = mymapYesReg.getZoom();
  //center = mymapYesReg.getCenter();
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
    seaLevel();
    climateEffect(seaLevelRiseNoReg, seaLevelRiseYesReg);
    return;
  }
  timeLapseBtn.value = "Resume";
  e.target.value= "Reset"
};
