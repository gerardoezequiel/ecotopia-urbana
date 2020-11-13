export const addOpenWeather = (map) => {
  map.addLayer({
    id: 'open-weather-map',
    type: 'raster',
    source: {
      type: 'raster',
      tiles: [
        'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=0c356d282baa6385fe0e0b14d8cbeb3e',
      ],
      tileSize: 256,
    },
    layout: { visibility: 'none' },
    minzoom: 0,
    maxzoom: 22,
  });
};
