const axios = require('axios');

const PVGIS_BASE_URL = 'https://re.jrc.ec.europa.eu/api/v5_3/';

const fetchPVGISData = async (latitude, longitude) => {
  try {
    const params = {
      lat: latitude,
      lon: longitude,
      outputformat: 'json',
      usehorizon: 1,
      angle: 0,
      aspect: 0,
      startyear: 2005,
      endyear: 2023,
      optimalangles: 0,
      timestep: 1, 
    };

    const response = await axios.get(`${PVGIS_BASE_URL}/seriescalc`, {
      params,
    });
    const hourlyData = response.data.outputs?.hourly;

    if (!hourlyData || hourlyData.length === 0) {
      console.error('No valid hourly JSON data found in the response.');
      throw new Error('Failed to retrieve hourly JSON data from PVGIS API');
    }

    // Aggregate hourly data into daily totals
    const dailyData = aggregateToDaily(hourlyData);
    return dailyData;
  } catch (error) {
    console.error('Error fetching PVGIS data:', error.message);
    throw new Error('Failed to fetch PVGIS data');
  }
};

function aggregateToDaily(hourlyData) {
  const dailyTotals = {};

  hourlyData.forEach((entry) => {
    const date = entry.time.slice(0, 8); // Extract date part from 'YYYYMMDD:HHMM'
    // console.log(date);
    const energy = parseFloat(entry['G(i)'] || entry.energy || 0); // Extract 'G(i)' value

    if (!dailyTotals[date]) {
      dailyTotals[date] = 0;
    }
    dailyTotals[date] += energy; // Sum up hourly energy for the day
  });

  // Convert daily totals from Wh/m² to kWh/m²
  return Object.entries(dailyTotals).map(([date, energy]) => ({
    date,
    energy: energy / 1000, // Conversion from Wh/m² to kWh/m²
  }));
}
module.exports = { fetchPVGISData };
