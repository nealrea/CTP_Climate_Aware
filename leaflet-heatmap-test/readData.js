const fs = require('fs');
const NetCDFReader = require('netcdfjs')

var file = 'ANN1960-1969.aijD0anl_0k.nc'; //local netCDF file

const data = fs.readFileSync(file);
var reader = new NetCDFReader(data);

var lat = reader.getDataVariable('lat');
var lon = reader.getDataVariable('lon');
var precip = reader.getDataVariable('prec');
var prec = {
	data: [],
};

var precCount = 0;
for(var i in lat){
	for(var j in lon){
		prec.data.push({
			lat: lat[i],
			lon: lon[j],
			value: precip[precCount++],
		})
	}
}

var max = prec.data.reduce((max, p) => p.value > max ? p.value : max, prec.data[0].value)
prec.max = max;

console.log(prec);

module.exports = prec;