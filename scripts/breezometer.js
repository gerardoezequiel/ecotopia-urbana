var apiKey = '8736ffa82743491abc5ed685a0c45f17'; // Your BreezoMeter API key
var mapBoxAccessToken =
  'pk.eyJ1IjoiZ2VyYWV6ZW1jIiwiYSI6ImNqM3N4YTY5ODAwNjYzMXFtd21peHp1b2sifQ.A-Y5AaoJWzn7tXFa1vvmlQ'; // your mapbox access token from: https://account.mapbox.com

map.on('load', function () {
  addRasterSource();
  addRasterLayer();
});

function addRasterSource() {
  map.addSource('breezometer-tiles', {
    type: 'raster',
    tiles: [
      `https://tiles.breezometer.com/v1/air-quality/breezometer-aqi/current-conditions/{z}/{x}/{y}.png?key=${apiKey}&breezometer_aqi_color=indiper`,
    ],
    tileSize: 256,
    maxzoom: 8,
  });
}

function addRasterLayer() {
  map.addLayer(
    {
      id: 'breezometer-tiles',
      type: 'raster',
      source: 'breezometer-tiles',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'raster-opacity': 0.6,
      },
    },
    'admin-1-boundary-bg',
  );
}
