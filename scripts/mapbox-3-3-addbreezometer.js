map.on('load', function () {
  var apiKey = '8736ffa82743491abc5ed685a0c45f17';
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;

  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addSource('breezometer-tiles', {
    type: 'raster',
    tiles: [
      `https://tiles.breezometer.com/v1/air-quality/breezometer-aqi/current-conditions/{z}/{x}/{y}.png?key=${apiKey}&breezometer_aqi_color=indiper`,
    ],
    tileSize: 256,
    maxzoom: 8,
  });

  map.addLayer(
    {
      id: 'breezometer-tiles',
      type: 'raster',
      source: 'breezometer-tiles',
      layout: { visibility: 'none' },
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'raster-opacity': 0.6,
      },
    },
    'admin-1-boundary-bg',
  );
});
