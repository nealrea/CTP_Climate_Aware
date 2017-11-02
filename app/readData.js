const fs = require('fs');
const NetCDFReader = require('netcdfjs')

var file = 'tas_Amon_GISS-E2-H-CC_rcp85_r1i1p1_205101-210012.nc'; //local netCDF file

const data = fs.readFileSync(file);
var reader = new NetCDFReader(data);

var lat = reader.getDataVariable('lat');
var lon = reader.getDataVariable('lon');
var diagnostic = reader.getDataVariable('tas')[0];
var dataObj = {
	points: [],
};

var valueCount = 0;
for(var i in lat){
	for(var j in lon){
		dataObj.points.push({
			lat: lat[i],
			lon: lon[j] - 180,
			value: diagnostic[valueCount++] - 273.15,
		})
	}
}

var max = dataObj.points.reduce((max, p) => p.value > max ? p.value : max, dataObj.points[0].value)
dataObj.max = max;

console.log(diagnostic[145]);

fs.writeFile("./test.json", JSON.stringify(dataObj));

module.exports = dataObj;