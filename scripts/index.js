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

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2VyYWV6ZW1jIiwiYSI6ImNqM3N4YTY5ODAwNjYzMXFtd21peHp1b2sifQ.A-Y5AaoJWzn7tXFa1vvmlQ';
  

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [2.15899, 41.38879],
  zoom: 2,
});

//Geocoder
var geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search your place here',
});

// Add the geocoder to the map
map.addControl(geocoder);

//Navigation control
map.addControl(new mapboxgl.NavigationControl());

//Full screen control
map.addControl(new mapboxgl.FullscreenControl());

//Geolocator controles
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
);

//togleable layers
var toggleableLayerIds = [
  'urban environment',
  'urban environment heatmap',
  'breezometer-tiles',
];

// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];

  var link = document.createElement('a');
  link.href = '#';
  link.className = 'active';
  link.textContent = id;

  link.onclick = function (e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === 'visible') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      this.className = '';
    } else {
      this.className = 'active';
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
  };

  var layers = document.getElementById('menu');
  layers.appendChild(link);
}
//!Loading the layers

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

//Show information by click

function onShowPOI(data, lngLat) {
  let poi = document.createElement('div');
  poi.innerHTML = '<h2>' + data.name + '<h2>';
  poi.innerHTML += '<p><i>' + getCategoryName(data.kinds) + '</i></p>';
  if (data.preview) {
    poi.innerHTML += "<img src='" + data.preview.source + "'>";
  }
  poi.innerHTML += data.wikipedia_extracts
    ? data.wikipedia_extracts.html
    : data.info
    ? data.info.descr
    : 'No description';

  poi.innerHTML +=
    "<p><a target='_blank' href='" +
    data.otm +
    "'>Show more at OpenTripMap</a></p>";

  new mapboxgl.Popup().setLngLat(lngLat).setDOMContent(poi).addTo(map);
}

map.on('click', 'urban environment', function (e) {
  let coordinates = e.features[0].geometry.coordinates.slice();
  let id = e.features[0].properties.id;
  let name = e.features[0].properties.name;

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  apiGet('xid/' + id).then((data) => onShowPOI(data, e.lngLat));
});

//Show popup by mousemove

let popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on('mouseenter', 'urban environment', function (e) {
  map.getCanvas().style.cursor = 'pointer';

  let coordinates = e.features[0].geometry.coordinates.slice();
  let id = e.features[0].properties.id;
  let name = e.features[0].properties.name;

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  popup
    .setLngLat(coordinates)
    .setHTML('<strong>' + name + '</strong>')
    .addTo(map);
});

map.on('mouseleave', 'urban environment', function () {
  map.getCanvas().style.cursor = '';
  popup.remove();
});

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
/* 
//Adding air quality data 

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

map.on('load', function () {
  addRoadsSource();
  addRoadsLayer();
});

function addRoadsSource() {
  map.addSource('roads', {
    type: 'vector',
    tiles: [
      `https://tiles.breezometer.com/v1/air-quality/traffic-pollution/current-conditions/{z}/{x}/{y}.pbf?key=${apiKey}`,
    ],
    minzoom: 0,
    maxzoom: 10,
  });
}

function addRoadsLayer() {
  map.addLayer(
    {
      id: 'road-borders',
      source: 'roads',
      'source-layer': 'brz-roads',
      type: 'line',
      layout: {
        'line-cap': 'round',
      },
      minzoom: 3,
      maxzoom: 24,
    },
    'admin-1-boundary-bg',
  );
}
 */

//Isochrone API

var params = document.getElementById('params');

// Create variables to use in getIso()
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -77.034;
var lat = 38.899;
var profile = 'cycling';
var minutes = 10;

// Set up a marker that you can use to show the query's coordinates
var marker = new mapboxgl.Marker({
  color: '#314ccd',
});

// Create a LngLat object to use in the marker initialization
// https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
var lngLat = {
  lon: lon,
  lat: lat,
};

// Create a function that sets up the Isochrone API query then makes an Ajax call
function getIso() {
  var query =
    urlBase +
    profile +
    '/' +
    lon +
    ',' +
    lat +
    '?contours_minutes=' +
    minutes +
    '&polygons=true&access_token=' +
    mapboxgl.accessToken;

  $.ajax({
    method: 'GET',
    url: query,
  }).done(function (data) {
    // Set the 'iso' source's data to what's returned by the API query
    map.getSource('iso').setData(data);
  });
}

// When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
params.addEventListener('change', function (e) {
  if (e.target.name === 'profile') {
    profile = e.target.value;
    getIso();
  } else if (e.target.name === 'duration') {
    minutes = e.target.value;
    getIso();
  }
});

map.on('load', function () {
  // When the map loads, add the source and layer
  map.addSource('iso', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  map.addLayer(
    {
      id: 'isoLayer',
      type: 'fill',
      source: 'iso',
      layout: {},
      paint: {
        'fill-color': '#5a3fc0',
        'fill-opacity': 0.3,
      },
    },
    'poi-label',
  );

  // Initialize the marker at the query coordinates
  marker.setLngLat(lngLat).addTo(map);

  // Make the API call
  getIso();
});