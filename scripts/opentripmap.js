const apiKey = '5ae2e3f221c38a28845f05b6ed0662748f2fdf24cede18cf28fcee8a';
export const addOpenTripLayer = (map) => {
  //Stylization
  
  //Add pois layer to the map
  map.addSource('opentripmap.pois', {
    type: 'vector',
    attribution:
      '<a href="https://opentripmap.io" target="_blank">© OpenTripMap</a>',
    bounds: [-180, -85.0511, 180, 85.0511],
    minzoom: 12,
    maxzoom: 20,
    scheme: 'xyz',
    tiles: [
      'https://api.opentripmap.com/0.1/en/tiles/pois/{z}/{x}/{y}.pbf?kinds=interesting_places,tourist_facilities,sport&rate=3&apikey=' +
        apiKey,
    ],
  });

  map.addLayer(
    {
      id: 'Interesting places',
      type: 'symbol',
      source: 'opentripmap.pois',
      layout: {
        'icon-image': 'circle-15',
        'icon-size': 0.5,
        
      },
      'source-layer': 'pois',
      minzoom: 12,
      maxzoom:20,
      /* paint: {
        'circle-color': 'rgb(55,144,144)',
        'circle-radius': 5,
        'circle-stroke-color': 'rgba(102,193,201, 0.6)',
        'circle-stroke-width': 0.6,
      }, */
    },
    'airport-label',
  );

  //Add heat layer to the map
  map.addSource('opentripmap.heat', {
    type: 'vector',
    bounds: [-180, -85.0511, 180, 85.0511],
    minzoom: 5,
    maxzoom: 12,
    scheme: 'xyz',
    tiles: [
      'https://api.opentripmap.com/0.1/en/tiles/heat/{z}/{x}/{y}.pbf?kinds=interesting_places&rate=3&apikey=' +
        apiKey,
    ],
  });

  map.addLayer(
    {
      id: 'Heatmap',
      type: 'heatmap',
      source: 'opentripmap.heat',
      'source-layer': 'heat',
      minzoom: 5,
      maxzoom: 12,
      filter: ['all'],
      paint: {
        'heatmap-radius': {
          stops: [
            [1, 3],
            [10, 3],
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
            [3, 0.5],
            [8, 0.3],
          ],
        },
        'heatmap-opacity': {
          stops: [
            [1, 0.7],
            [8, 0.3],
          ],
        },
      },
    },
    'Interesting places',
  );
};
