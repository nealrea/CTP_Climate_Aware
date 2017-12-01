const fs = require('fs');
const NetCDFReader = require('netcdfjs')

module.exports.calculateData = (diagnostic,regMode,year) => {
	const file = fs.readFileSync("../data/yearlyData/" + diagnostic + "-" + regMode + "-" + year + ".nc");
	var reader = new NetCDFReader(file);

	var lat = reader.getDataVariable('lat');
	var lon = reader.getDataVariable('lon');
	if(diagnostic === "tas"){
		var diag = reader.getDataVariable("temperature");
	}else if(diagnostic === "pr"){
		var diag = reader.getDataVariable("precipitation");
	}
	var data = {
		data: [],
	};



	var valueCount = 0;
	for(var i in lat){
		for(var j in lon){
			if(diagnostic === "tas"){
				data.data.push({
					lat: lat[i],
					lon: lon[j] - 180,
					value: diag[valueCount++] - 273.15,
				})
			}else{
				data.data.push({
					lat: lat[i],
					lon: lon[j] - 180,
					value: diag[valueCount++],
				})
			}
		}
	}

	//static min/max for color standardization
	if(diagnostic === "tas"){
		data.min = -10 ; //chop min to exagerate color
		data.max = 45.12 ;
	}else{
		var max = data.data.reduce((max, p) => p.value > max ? p.value : max, data.data[0].value)
		data.max = max;
		var min = data.data.reduce((min, p) => p.value < min ? p.value : min, data.data[0].value)
		data.min = min;
	}

	return data;
};

/*
var fileNoReg = '../data/pr-without-regulations.nc'; //local netCDF file
var fileYesReg = '../data/pr-with-regulations.nc'; //local netCDF file

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
*/

//console.log(diagnostic[145]);

//fs.writeFile("./noReg.json", JSON.stringify(dataObjNoReg));
//fs.writeFile("./yesReg.json", JSON.stringify(dataObjYesReg));

//module.exports = dataObjNoReg, dataObjYesReg;
