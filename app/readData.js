const fs = require('fs');
const NetCDFReader = require('netcdfjs')

var fileNoReg = '../tas_Amon_GISS-E2-H_rcp85_r1i1p1_225101-230012.nc'; //local netCDF file
var fileYesReg = '../tas_Amon_GISS-E2-H_rcp26_r1i1p1_225101-230012.nc'; //local netCDF file

const dataNoReg = fs.readFileSync(fileNoReg);
var readerNoReg = new NetCDFReader(dataNoReg);
const dataYesReg = fs.readFileSync(fileYesReg);
var readerYesReg = new NetCDFReader(dataYesReg);

var lat = readerNoReg.getDataVariable('lat');
var lon = readerNoReg.getDataVariable('lon');
var diagnosticNoReg = readerNoReg.getDataVariable('tas')[0];
var diagnosticYesReg = readerYesReg.getDataVariable('tas')[0];
var dataObjNoReg = {
	points: [],
};
var dataObjYesReg = {
	points: [],
};

var valueCount = 0;
for(var i in lat){
	for(var j in lon){
		dataObjNoReg.points.push({
			lat: lat[i],
			lon: lon[j] - 180,
			value: diagnosticNoReg[valueCount++] - 273.15,
		})
	}
}
var valueCount = 0;
for(var i in lat){
	for(var j in lon){
		dataObjYesReg.points.push({
			lat: lat[i],
			lon: lon[j] - 180,
			value: diagnosticYesReg[valueCount++] - 273.15,
		})
	}
}

var maxNoReg = dataObjNoReg.points.reduce((max, p) => p.value > max ? p.value : max, dataObjNoReg.points[0].value)
dataObjNoReg.max = maxNoReg;
var maxYesReg = dataObjYesReg.points.reduce((max, p) => p.value > max ? p.value : max, dataObjYesReg.points[0].value)
dataObjYesReg.max = maxYesReg;

var minNoReg = dataObjNoReg.points.reduce((min, p) => p.value < min ? p.value : min, dataObjNoReg.points[0].value)
dataObjNoReg.min = minNoReg;
var minYesReg = dataObjYesReg.points.reduce((min, p) => p.value < min ? p.value : min, dataObjYesReg.points[0].value)
dataObjYesReg.min = minYesReg;

//console.log(diagnostic[145]);

fs.writeFile("./noReg.json", JSON.stringify(dataObjNoReg));
fs.writeFile("./yesReg.json", JSON.stringify(dataObjYesReg));

module.exports = dataObjNoReg, dataObjYesReg;