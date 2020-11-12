// //Isochrone API

// var params = document.getElementById('params');

// //api.mapbox.com/isochrone/v1/mapbox/cycling/-0.09401410262574927%2C51.4876156400322?contours_minutes=15%2C30%2C45%2C60&polygons=true&denoise=1&generalize=0&access_token=YOUR_MAPBOX_ACCESS_TOKEN

// // Create variables to use in getIso()
// https: var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
// var lon = -0.10234470000000001;
// var lat = 51.483421799999995;
// var profile = 'walking';
// var minutes = 5;

// // Set up a marker that you can use to show the query's coordinates
// var marker = new mapboxgl.Marker({
//   color: '#314ccd',
//   draggable: false,
// });

// // Create a LngLat object to use in the marker initialization
// // https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
// var lngLat = {
//   lon: lon,
//   lat: lat,
// };

// // Create a function that sets up the Isochrone API query then makes an Ajax call
// async function getIso() {
//   // const [longitude, latitude] = await getLocation();

//   // console.log({ coordinates });

//   var query =
//     urlBase +
//     profile +
//     '/' +
//     lon +
//     ',' +
//     lat +
//     '?contours_minutes=' +
//     minutes +
//     '&polygons=true&access_token=' +
//     mapboxgl.accessToken;

//   $.ajax({
//     method: 'GET',
//     url: query,
//   }).done(function (data) {
//     // Set the 'iso' source's data to what's returned by the API query
//     map.getSource('iso').setData(data);
//   });
// }

// // When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
// params.addEventListener('change', function (e) {
//   if (e.target.name === 'profile') {
//     profile = e.target.value;
//     getIso();
//   } else if (e.target.name === 'duration') {
//     minutes = e.target.value;
//     getIso();
//   }
// });

// map.on('load', function () {
//   // When the map loads, add the source and layer
//   map.addSource('iso', {
//     type: 'geojson',
//     data: {
//       type: 'FeatureCollection',
//       features: [],
//     },
//   });

//   map.addLayer(
//     {
//       id: 'isoLayer',
//       type: 'fill',
//       source: 'iso',
//       layout: { visibility: 'none' },
//       paint: {
//         'fill-color': '#5a3fc0',
//         'fill-opacity': 0.3,
//       },
//     },
//     'poi-label',
//   );

//   // Initialize the marker at the query coordinates
//   marker.setLngLat(lngLat).addTo(map);

//   // Make the API call
//   getIso();
// });
