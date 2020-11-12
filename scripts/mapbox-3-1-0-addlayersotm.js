//Open trip map
var apiKey = '5ae2e3f221c38a28845f05b6ed0662748f2fdf24cede18cf28fcee8a';

//API request
function apiGet(method, query) {
  return new Promise(function (resolve, reject) {
    var otmAPI =
      'https://api.opentripmap.com/0.1/en/places/' +
      method +
      '?apikey=' +
      apiKey;
    if (query !== undefined) {
      otmAPI += '&' + query;
    }
    fetch(otmAPI)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  });
}


map.on('load', function () {
  //Stylization

  //Add pois layer to the map
  map.addSource('opentripmap.pois', {
    type: 'vector',
    attribution:
      '<a href="https://opentripmap.io" target="_blank">© OpenTripMap</a>',
    bounds: [-180, -85.0511, 180, 85.0511],
    minzoom: 8,
    maxzoom: 14,
    scheme: 'xyz',
    tiles: [
      'https://api.opentripmap.com/0.1/en/tiles/pois/{z}/{x}/{y}.pbf?kinds=interesting_places&rate=1&apikey=' +
        apiKey,
    ],
  });
  map.addLayer(
    {
      id: 'opentripmap-pois',
      type: 'circle',
      source: 'opentripmap.pois',
      'source-layer': 'pois',
      minzoom: 8,
      paint: {
        'circle-color': 'rgb(55,144,144)',
        'circle-radius': 5,
        'circle-stroke-color': 'rgba(102,193,201, 0.6)',
        'circle-stroke-width': 0.6,
      },
    },
    'airport-label',
  );

  //Add heat layer to the map
  map.addSource('opentripmap.heat', {
    type: 'vector',
    bounds: [-180, -85.0511, 180, 85.0511],
    minzoom: 1,
    maxzoom: 8,
    scheme: 'xyz',
    tiles: [
      'https://api.opentripmap.com/0.1/en/tiles/heat/{z}/{x}/{y}.pbf?kinds=interesting_places&rate=1&apikey=' +
        apiKey,
    ],
  });
  map.addLayer(
    {
      id: 'opentripmap-heat',
      type: 'heatmap',
      source: 'opentripmap.heat',
      'source-layer': 'heat',
      minzoom: 1,
      maxzoom: 10,
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
    'opentripmap-pois',
  );
});