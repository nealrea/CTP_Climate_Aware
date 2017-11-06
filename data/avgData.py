#	This script takes netCDF4 temperature and precipitation data that is aggregated monthly from January 2006 through December 2300 
#	both with and without regulations on greenhouse gas emissions, and outputs four netCDF4 files: 
#	temperature-with-regulations.nc, temperature-without-regulations.nc, precipitation-with-regulations.nc, and precipitation-without-regulations.nc
#	These new files contain yearly averages of each diagnostic.

import netCDF4 as nc
import numpy as np

diagnostics = ['pr','tas']
regModes = ['rcp26','rcp85']
timeSlices = ['200601-205012','205101-210012','210101-215012','215101-220012','220101-225012','225101-230012']
namingDict = {'pr': 'precipitation', 'tas': 'temperature', 'rcp26': 'with-regulations', 'rcp85': 'without-regulations'}

sampleData = nc.Dataset('pr_Amon_GISS-E2-H_rcp26_r1i1p1_200601-205012.nc')

for diag in diagnostics:
	for mode in regModes:
		lat = np.array(sampleData.variables['lat'])
		lon = np.array(sampleData.variables['lon'])
		t = np.arange(2006,2301)	#create time array of years 2006-2300
		new_file = nc.Dataset(namingDict[diag] + '-' + namingDict[mode] + '.nc','w',format='NETCDF4')
		new_file.createDimension('time', 295)	#create time dimension of years 2301-2006 = 295
		new_file.createDimension('lat', len(lat))
		new_file.createDimension('lon', len(lon))
		longitude = new_file.createVariable('lon', 'f4', 'lon')
		longitude[:] = lon
		latitude = new_file.createVariable('lat', 'f4', 'lat')
		latitude[:] = lat
		time = new_file.createVariable('time', 'i', 'time')
		time[:] = t

		finalMean = []
		for timeSlice in timeSlices:
			data = nc.Dataset(diag + '_Amon_GISS-E2-H_' + mode + '_r1i1p1_' + timeSlice + '.nc')
			var = data.variables[diag]

			for i in range(0,len(var)):
				if (i+1)%12 == 1:
					startSlice = i;
				if (i+1)%12 == 0:
					endSlice = i;
					mean = np.average(var[startSlice:endSlice], axis=0)
					finalMean = np.append(finalMean, mean)

		finalMean.shape = (295, 90, 144)
		yrlyAvg = new_file.createVariable(namingDict[diag], 'f4', ('time','lat','lon'))
		for i in range(0,295):
			yrlyAvg[i,:,:] = finalMean[i]
		new_file.close()