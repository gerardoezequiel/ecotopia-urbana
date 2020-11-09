const getLocation = function () {
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
