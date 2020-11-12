//Geocoder
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  marker: {
    color: 'red',
  },
  mapboxgl: mapboxgl,
});

map.addControl(geocoder);

geocoder.on('result', function (e) {
  console.log(e.result.center);
  geocoder.clear();
  var marker = new mapboxgl.Marker({ draggable: true, color: 'red' })
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
