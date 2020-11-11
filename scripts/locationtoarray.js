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
  .then((arrLocations) => console.log(arrLocations))
  .catch((err) => console.log('there was an error: ', err));

//////////////////////////////////

const success = (position) => {
  const {
    coords: { latitude, longitude },
  } = position;
  console.log({ latitude, longitude });
  return {latitude, longitude}


};
const error = (errorMessage) => {
  console.error('Something went wrong', errorMessage);
};
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  console.error('navigator is not enabled in this browser');
}

//////////////////////
var geolocate = new mapboxgl.GeolocateControl();

map.addControl(geolocate);

geolocate.on('geolocate', function (e) {
  var lon = e.coords.longitude;
  var lat = e.coords.latitude;
  var position = [lon, lat];
  console.log(position);
});


  ///////////////////
var array = [];
navigator.geolocation.getCurrentPosition(function (position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  array.push(lat, lon);
  
});