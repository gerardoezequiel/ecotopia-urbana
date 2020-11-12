import { addOpenTripLayer } from './open-trip.js';
import { addIsoChrone, onChangeParams } from './isochrone.js';
import { getLabelLayerId } from './helper-functions.js';
import { addBuildingLayer } from './building.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2VyYWV6ZW1jIiwiYSI6ImNqM3N4YTY5ODAwNjYzMXFtd21peHp1b2sifQ.A-Y5AaoJWzn7tXFa1vvmlQ';

const getLocation = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve([position.coords.longitude, position.coords.latitude]),
      (error) => reject(error),
    );
  });
};

let longitude;
let latitude;
let map;

window.addEventListener('DOMContentLoaded', async () => {
  [longitude, latitude] = await getLocation();

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    attributionControl: false,
    center: [longitude, latitude],
    zoom: 10,
  });

  //Geocoder
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
      color: 'red',
    },
    mapboxgl,
  });

  map.addControl(geocoder);

  geocoder.on('result', (e) => {
    console.log(e.result.center);
    geocoder.clear();
    new mapboxgl.Marker({ draggable: true, color: 'red' })
      .setLngLat(e.result.center)
      .addTo(map);
  });
  // Add the geocoder to the map

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

  const toggleableLayerIds = [
    'interesting places',
    'interesting places heatmap',
    'breezometer-tiles',
    'open-weather-map',
    'isoLayer',
    '3d-buildings',
  ];

  toggleableLayerIds.forEach((id) => {
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const clickedLayer = event.currentTarget.textContent;

      const visibility = map.getLayoutProperty(clickedLayer, 'visibility');

      // toggle layer visibility by changing the layout object's visibility property
      if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        event.currentTarget.className = '';
      } else {
        event.currentTarget.className = 'active';
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      }
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);
  });

  //Isochrone API

  const params = document.getElementById('params');

  //api.mapbox.com/isochrone/v1/mapbox/cycling/-0.09401410262574927%2C51.4876156400322?contours_minutes=15%2C30%2C45%2C60&polygons=true&denoise=1&generalize=0&access_token=YOUR_MAPBOX_ACCESS_TOKEN

  // Create variables to use in getIso()
  const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
  // var lon = -0.10234470000000001;
  // var lat = 51.483421799999995;
  let profile = 'walking';
  let minutes = 5;

  // Set up a marker that you can use to show the query's coordinates
  const marker = new mapboxgl.Marker({
    color: '#314ccd',
    draggable: false,
  });

  // Create a function that sets up the Isochrone API query then makes an Ajax call
  const getIso = async () => {
    const query = `${urlBase}${profile}/${longitude},${latitude}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(query);
    const data = await response.json();
    map.getSource('iso').setData(data);
  };

  // When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again

  params.addEventListener('change', onChangeParams);

  map.on('load', async () => {
    await addIsoChrone({ map, marker, getIso, longitude, latitude });
    addOpenTripLayer(map);
    addBuildingLayer(map);
  });

  map.addControl(
    new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking',
    }),
    'bottom-left',
  );

  //Open trip map
  const apiKey = '5ae2e3f221c38a28845f05b6ed0662748f2fdf24cede18cf28fcee8a';

  const apiGet = async (method, query) => {
    const url =
      query !== undefined
        ? `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${apiKey}&${query}`
        : `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${apiKey}`;

    const response = await fetch(url);
    return await response.json();
  };

  // map.on('load', () => {
  //   // Insert the layer beneath any symbol layer.
  //   const layers = map.getStyle().layers;

  //   const labelLayerId = getLabelLayerId(layers);

  //   map.addLayer(
  //     {
  //       id: '3d-buildings',
  //       source: 'composite',
  //       'source-layer': 'building',
  //       filter: ['==', 'extrude', 'true'],
  //       type: 'fill-extrusion',
  //       minzoom: 15,
  //       paint: {
  //         'fill-extrusion-color': '#aaa',

  //         // use an 'interpolate' expression to add a smooth transition effect to the
  //         // buildings as the user zooms in
  //         'fill-extrusion-height': [
  //           'interpolate',
  //           ['linear'],
  //           ['zoom'],
  //           15,
  //           0,
  //           15.05,
  //           ['get', 'height'],
  //         ],
  //         'fill-extrusion-base': [
  //           'interpolate',
  //           ['linear'],
  //           ['zoom'],
  //           15,
  //           0,
  //           15.05,
  //           ['get', 'min_height'],
  //         ],
  //         'fill-extrusion-opacity': 0.6,
  //       },
  //     },
  //     labelLayerId,
  //   );
  // });

  map.on('load', function () {
    const apiKey = '8736ffa82743491abc5ed685a0c45f17';
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;

    const labelLayerId = getLabelLayerId(layers);

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

  map.on('load', function () {
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
  });

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

  map.on('click', 'opentripmap-pois', function (e) {
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

  map.on('mouseenter', 'opentripmap-pois', function (e) {
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

  map.on('mouseleave', 'opentripmap-pois', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
}); // end of window onload

// map.on('load', async () => {
//   await map.flyTo({ center: [longitude, latitude], zoom: 15 });
// });
