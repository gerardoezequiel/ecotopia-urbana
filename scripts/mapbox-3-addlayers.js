//!Loading the layers
//Adding info from otm

map.on('load', function () {
  //Add pois layer to the map
  map.addSource('urban environment', {
    type: 'vector',
    attribution:
      '<a href="https://opentripmap.io" target="_blank">© Gerardo Ezequiel</a>',
    bounds: [-180, -85.0511, 180, 85.0511],
    minzoom: 8,
    maxzoom: 15,
    scheme: 'xyz',
    tiles: [
      'https://api.opentripmap.com/0.1/en/tiles/pois/{z}/{x}/{y}.pbf?kinds=museums&rate=1&apikey=' +
        apiKey,
    ],
  });
  map.addLayer({
    id: 'urban environment',
    type: 'circle',
    source: 'urban environment',
    'source-layer': 'pois',
    minzoom: 8,
    paint: {
      'circle-color': 'rgb(55,144,144)',
      'circle-radius': 5,
      'circle-stroke-color': 'rgba(102,193,201, 0.6)',
      'circle-stroke-width': 0.6,
    },
  });

  //Add heat layer to the map
  map.addSource('urban environment heatmap', {
    type: 'vector',
    bounds: [-180, -85.0511, 180, 85.0511],
    minzoom: 1,
    maxzoom: 8,
    scheme: 'xyz',
    tiles: [
      'https://api.opentripmap.com/0.1/en/tiles/heat/{z}/{x}/{y}.pbf?kinds=museums&rate=1&apikey=' +
        apiKey,
    ],
  });
  map.addLayer(
    {
      id: 'urban environment heatmap',
      type: 'heatmap',
      source: 'urban environment heatmap',
      'source-layer': 'heat',
      minzoom: 1,
      maxzoom: 12,
      filter: ['all'],
      paint: {
        'heatmap-radius': {
          stops: [
            [1, 4],
            [10, 20],
          ],
        },
        'heatmap-weight': ['get', 'n'],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(236,222,239,0)',
          0.1,
          'rgb(210,180,160)',
          0.2,
          'rgb(255,221,149)',
          0.6,
          'rgb(253,104,96)',
        ],
        'heatmap-intensity': {
          stops: [
            [3, 0.1],
            [8, 0.8],
          ],
        },
        'heatmap-opacity': {
          stops: [
            [1, 0.9],
            [8, 0.3],
          ],
        },
      },
    },
    'urban environment',
  );
});


//Adding 3d-buildings

map.on('load', function () {
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;

  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addLayer(
    {
      id: '3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.6,
      },
    },
    labelLayerId,
  );
});
