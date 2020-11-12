mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2VyYWV6ZW1jIiwiYSI6ImNqM3N4YTY5ODAwNjYzMXFtd21peHp1b2sifQ.A-Y5AaoJWzn7tXFa1vvmlQ';
/* var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.4512, 43.6568],
  zoom: 13,
}); */


map.addControl(
  new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/walking'
  }),
  'bottom-left',
);
 
/* 
map.on('load', () => {
  button.addEventListener('dblclick', function () {
    map.removeControl(directions);
  });

  removeWaypointsButton.addEventListener('dblclick', function () {
    directions.removeRoutes();
  });

  
});  */