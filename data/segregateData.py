import netCDF4 as nc
import numpy as np

diagnostics = ['pr','tas']
regModes = ['with-regulations','without-regulations']
diagDict = {'pr': 'precipitation', 'tas': 'temperature'}

sampleData = nc.Dataset('yearlyData/pr-with-regulations.nc')

for diag in diagnostics:
	for mode in regModes:
		for i in range(2006,2301):
			lat = np.array(sampleData.variables['lat'])
			lon = np.array(sampleData.variables['lon'])
			new_file = nc.Dataset(diag + '-' + mode + '-' + str(i) + '.nc','w',format='NETCDF3_CLASSIC')
			new_file.createDimension('lat', len(lat))
			new_file.createDimension('lon', len(lon))
			longitude = new_file.createVariable('lon', 'f4', 'lon')
			longitude[:] = lon
			latitude = new_file.createVariable('lat', 'f4', 'lat')
			latitude[:] = lat

			data = nc.Dataset('yearlyData/' + diag + '-' + mode + '.nc')
			var = data.variables[diagDict[diag]]

			new_diag = new_file.createVariable(diagDict[diag], 'f4', ('lat','lon'))
			new_diag[:,:] = var[i - 2006]
			new_file.close()