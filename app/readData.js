const fs = require('fs');
const NetCDFReader = require('netcdfjs')

var file = 'ANN1960-1969.aijD0anl_0k.nc'; //local netCDF file

const data = fs.readFileSync(file);
var reader = new NetCDFReader(data);

var lat = reader.getDataVariable('lat');
var lon = reader.getDataVariable('lon');
var precip = reader.getDataVariable('prec');
var prec = [];

var precCount = 0;
for(var i = 0; i < lat.length; i++){
	for(var j = 0; j < lon.length; j++){
		prec.push([lat[i], lon[j], precip[precCount++]])
	}
}

console.log(prec);