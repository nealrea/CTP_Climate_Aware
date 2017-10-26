var testData = {
  max: 8,
  data: [
  	{lat: 50, lon:-1, count: 1},
  	{lat: 52, lon:-1, count: 1.2},
  	{lat: 54, lon:-1, count: 2.4},
  	{lat: 56, lon:-1, count: 1.5},
  	{lat: 58, lon:-1, count: 0.9},
  ]
};

var baseLayer = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '...',
    maxZoom: 18
  }
);

var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 2,
  "maxOpacity": .8, 
  // scales the radius based on map zoom
  "scaleRadius": true, 
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries 
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lon',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};


var heatmapLayer = new HeatmapOverlay(cfg);

var mymap = new L.Map('mapid', {
  center: new L.LatLng(51, -1.55),
  zoom: 4,
  layers: [baseLayer, heatmapLayer]
});

heatmapLayer.setData(testData);