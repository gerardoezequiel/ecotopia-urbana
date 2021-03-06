  import { getLabelLayerId } from './helper-functions.js';

export const addBreezometer = (map) => {
  const apiKey = '8736ffa82743491abc5ed685a0c45f17';
  const layers = map.getStyle().layers;

  getLabelLayerId(layers);

  map.addSource('Air quality', {
    type: 'raster',
    attribution:
      '<a href="https://breezometer.com/" target="_blank">© Breezometer</a>',
    tiles: [
      `https://tiles.breezometer.com/v1/air-quality/breezometer-aqi/current-conditions/{z}/{x}/{y}.png?key=${apiKey}&breezometer_aqi_color=indiper`,
    ],
    tileSize: 256,
    maxzoom: 8,
  });

  map.addLayer(
    {
      id: 'Air quality',
      type: 'raster',
      source: 'Air quality',
      layout: { visibility: 'none' },
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'raster-opacity': 0.6,
      },
    },
    'admin-1-boundary-bg',
  );
};
