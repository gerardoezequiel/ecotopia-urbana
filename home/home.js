var lat = 56.713;
var lng = 21.1644;

function showMap() {
  try {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZ2VyYWV6ZW1jIiwiYSI6ImNqM3N4YTY5ODAwNjYzMXFtd21peHp1b2sifQ.A-Y5AaoJWzn7tXFa1vvmlQ';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat], // starting position [lng, lat]
      zoom: 3, // starting zoom
      pitch: 0,
    });
  } catch (e) {
    alert('Error trying to add map:\n' + e.message);
  }
}

fetch('https://ipinfo.io')
  .then((json) => {
    var loc = json.loc.split(',');
    lat = loc[0];
    lng = loc[1];
  })
  .catch((err) => {
    alert('Error fetching lat long:\n' + error.message);
  })
  .finally(() => showMap());
