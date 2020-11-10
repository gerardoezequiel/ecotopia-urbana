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
  'open-weather-map',
  'isoLayer',
  '3d-buildings'
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

//Isochrone API

var params = document.getElementById('params');

// Create variables to use in getIso()
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -0.10234470000000001;
var lat = 51.483421799999995;
var profile = 'walking';
var minutes = 5;

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

//switch layers
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
  var layerId = layer.target.id;
  map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer;
}
