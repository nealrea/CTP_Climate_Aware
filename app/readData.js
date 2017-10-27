const fs = require('fs');
const NetCDFReader = require('netcdfjs')

var file = 'ANN1960-1969.aijD0anl_0k.nc'; //local netCDF file

const data = fs.readFileSync(file);
var reader = new NetCDFReader(data);

var lat = reader.getDataVariable('lat');
var lon = reader.getDataVariable('lon');
var diagnostic = reader.getDataVariable('prec');
var dataObj = {
	points: [],
};

var valueCount = 0;
for(var i in lat){
	for(var j in lon){
		dataObj.points.push({
			lat: lat[i],
			lon: lon[j],
			value: diagnostic[valueCount++],
		})
	}
}

var max = dataObj.points.reduce((max, p) => p.value > max ? p.value : max, dataObj.points[0].value)
dataObj.max = max;

//console.log(prec);

fs.writeFile("./test.json", JSON.stringify(dataObj));

module.exports = dataObj;