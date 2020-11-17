import { addOpenTripLayer } from './opentripmap.js';
import { addIsoChrone } from './isochrone.js';
import { addBuildingLayer } from './buildings3d.js';
import { addBreezometer } from './breezeometer.js';
import { addOpenWeather } from './open-weather.js';
import { addOtmPopUp } from './otm-popup.js'; 

mapboxgl.accessToken =
  'pk.eyJ1IjoiZWZhY3VuZG9hcmdhbmEiLCJhIjoiY2p3em8wNzkzMHV0eDN6cG9xMDkyY3MweCJ9.BFwFTr19FLGdPHqxA8qkiQ';

const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve([position.coords.longitude, position.coords.latitude]),
      (error) => reject(error),
    );
  });
};
//The coordinates wait until the IP coordinates are found (async)
window.addEventListener('DOMContentLoaded', async () => {
  const [longitude, latitude] = await getLocation();
  //Principal options of the map
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/geraezemc/ckhif49jm2l3x19ot4hmqsvz5',
    attributionControl: true,
    center: [longitude, latitude],
    zoom: 8,
    pitch: 225,
    bearing: 45, 
  });
  //Lets fly!
 map.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    center: [longitude, latitude],
    zoom: 18,
    bearing: 0,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 0.1, // make the flying slow
    curve: 5, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function (t) {
      return t;
    },

    // this animation is considered essential with respect to prefers-reduced-motion
    essential: true,
  });

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
    //Scale control
  map.addControl(
    new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric',
    }),
    'bottom-right',
  );
    
  // A toggle to manage multiple layers
  const toggleableLayerIds = [
    'Isochrone',
    'Interesting places',
    'Heatmap',
    'Air quality',
    'Weather',
    '3D Buildings',
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

  //Isochrone API Mapbox

  const params = document.getElementById('params');

  // Create variables to use in getIso()
  const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
  //lon = -0.10234470000000001;
  //lat = 51.483421799999995;
  let profile = 'walking';
  let minutes = 15;

  // Set up a marker that you can use to show the query's coordinates
  const marker = new mapboxgl.Marker({
    color: '#314ccd',
    draggable: false,
  });

  //Create a function that sets up the Isochrone API query then makes a call
  const getIso = async () => {
    const query = `${urlBase}${profile}/${longitude},${latitude}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(query);
    const data = await response.json();
    map.getSource('iso').setData(data);
  };
  //If the user click in the buttom the value (html) it's passed to the query
  const onChangeParams = async (event) => {
    if (event.target.name === 'profile') {
      profile = event.target.value;
      await getIso();
    } else if (event.target.name === 'duration') {
      minutes = event.target.value;
      await getIso();
    }
  };

  // When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again

  params.addEventListener('change', onChangeParams);

  map.on('load', async () => {
    addOpenTripLayer(map);
    addBreezometer(map);
    addOpenWeather(map);
    await addIsoChrone({ map, marker, getIso, longitude, latitude });
    addOtmPopUp({ map });
    addBuildingLayer(map);
    directions.setOrigin([longitude, latitude]);
  });

  //Adding the direction controller with IP direction as origin
  const directions = new MapboxDirections({
    unit: 'metric',
    profile: 'mapbox/walking',
    setOrigin: [longitude, latitude],
    alternatives: true,
    accessToken: mapboxgl.accessToken,
  });

  map.addControl(directions, 'bottom-left');
  
  //Removing the driving and driving traffic buttom
  document
    .querySelector('label[for="mapbox-directions-profile-driving-traffic"]')
    .remove();
  document
    .querySelector('label[for="mapbox-directions-profile-driving"]')
    .remove();
}); // end of window onload
