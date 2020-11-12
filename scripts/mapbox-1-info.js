mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2VyYWV6ZW1jIiwiYSI6ImNqM3N4YTY5ODAwNjYzMXFtd21peHp1b2sifQ.A-Y5AaoJWzn7tXFa1vvmlQ';



var getLocation = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve([position.coords.longitude, position.coords.latitude]),
      (error) => reject(error),
    );
  });
};
// to use it:
getLocation()
  .then(function (data) {
    userLocation = data;
    map.flyTo({ center: userLocation, zoom: 15 });
  })
  .catch((err) => console.log('there was an error: ', err));
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  attributionControl: false,
  // center: [-0.0844093, 51.4894947],
  // zoom: 15,
});

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-0.0844093, 51.4894947],
  zoom: 8,
  attributionControl: false,
}); 

function HelloWorldControl() {}

HelloWorldControl.prototype.onAdd = function (map) {
  this._map = map;
  this._container = document.createElement('div');
  this._container.className = 'mapboxgl-ctrl';
  this._container.innerHTML =
    "© <a href='https://www.linkedin.com/in/gerardoezequiel'>Gerardo Ezequiel</a>";
  return this._container;
};

HelloWorldControl.prototype.onRemove = function () {
  this._container.parentNode.removeChild(this._container);
  this._map = undefined;
};

var HWC = new HelloWorldControl();

map.on('load', function () {
  map.addControl(HWC, 'bottom-right');
});
