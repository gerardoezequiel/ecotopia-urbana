mapboxgl.accessToken =
  "pk.eyJ1IjoiZWZhY3VuZG9hcmdhbmEiLCJhIjoiY2p3em8wNzkzMHV0eDN6cG9xMDkyY3MweCJ9.BFwFTr19FLGdPHqxA8qkiQ";


// Set up an object to track app state and data
var isoAppData = {
  params: {
    urlBase: "https://api.mapbox.com/isochrone/v1/mapbox/", 
    profile: "cycling/",
    minutes: 10,
    category: "cafe",
  },
  origins: {
    a: [2.15899, 41.38879],
    b: [2.17899, 41.40],
  },
  isos: {
    a: {},
    b: {},
  },
};

// Grab the elements from the DOM to assign interactivity
var params = document.getElementById("params");
var msg = document.getElementById("msg");

// Basic map instance (zoomed to CABA, Argentina)
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10?optimize=true",
  center: [2.15899, 41.38879],
  zoom: 12,
});

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: "Buscar Ciudades",
  
});

map.addControl(geocoder, "top-right");

// Get a single isochrone for a given position and return the GeoJSON
var getIso = function getIso(position) {
  // Build the URL for the isochrone API
  var isoUrl =
    isoAppData.params.urlBase +
    isoAppData.params.profile +
    position.join(",") +
    "?contours_minutes=" +
    isoAppData.params.minutes +
    "&polygons=true&access_token=" +
    mapboxgl.accessToken;

  // Return the GeoJSON
  return fetch(isoUrl).then(function (res) {
    return res.json();
  });
};

var getPlaces = function getPlaces(area) {
  var bbox = turf.bbox(area);
  var center = turf.center(area);
  var category = isoAppData.params.category;
  var placesUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    category +
    ".json?access_token=" +
    mapboxgl.accessToken +
    "&types=poi&bbox=" +
    bbox.join(",") +
    "&proximity=" +
    center.geometry.coordinates.join(",") +
    "&limit=10";
  return fetch(placesUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (places) {
      for (var i = 0; i < places.features.length; i++) {
        places.features[i].properties.name = places.features[i].text;
      }
      var meetHere = turf.pointsWithinPolygon(places, area);
      map.getSource("places").setData(meetHere);
      map.setLayoutProperty(
        "meet-here",
        "icon-image",
        isoAppData.params.category + "-15"
      );
    });
};

var getIntersection = function getIntersection() {
  // This buffer may fix the intersection topology problem
  var isoBuffA = turf.buffer(isoAppData.isos.a.features[0], 0.001);
  var isoBuffB = turf.buffer(isoAppData.isos.b.features[0], 0.001);

  var intersection = turf.intersect(isoBuffA, isoBuffB);

  // Update the message to provide info to the user
  if (intersection) {
    getPlaces(intersection);
    map.getSource("intersection").setData(intersection);
    msg.innerText =
      "Área común: " +
      (turf.area(intersection) / 1000000).toFixed(1) +
      " km cuadrados";
  } else {
    map.getSource("intersection").setData({
      type: "FeatureCollection",
      features: [],
    });
    map.getSource("places").setData({
      type: "FeatureCollection",
      features: [],
    });
    msg.innerText =
      "No hay intersección. Intentá cambiar el modo de viaje o el límite de tiempo.";
  }
};

// Update the map sources so the isochrones draw on the map
var setIsos = function setIsos(isos) {
  // Save the isochrone data into the app object
  isoAppData.isos.a = isos[0];
  isoAppData.isos.b = isos[1];

  // Update the map
  map.getSource("isoA").setData(isoAppData.isos.a);
  map.getSource("isoB").setData(isoAppData.isos.b);

  // Use turf to get the intersections
  getIntersection();
};

// Get the isochrone data from the API, then update the map
var getIsos = function getIsos() {
  var isochroneA = getIso(isoAppData.origins.a);
  var isochroneB = getIso(isoAppData.origins.b);

  // Once the isochrones are received, update the map
  Promise.all([isochroneA, isochroneB]).then(function (values) {
    setIsos(values);
  });
};

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

// Map setup stuff
map.on("load", function () {
  // Add sources and layers for the two isochrones
  map.addSource("isoA", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer(
    {
      id: "isoLayerA",
      type: "fill",
      source: "isoA",
      layout: {},
      paint: {
        "fill-color": "purple",
        "fill-opacity": 0.3,
      },
    },
    "poi-label"
  );

  map.addSource("isoB", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer(
    {
      id: "isoLayerB",
      type: "fill",
      source: "isoB",
      layout: {},
      paint: {
        "fill-color": "lightblue",
        "fill-opacity": 0.3,
      },
    },
    "poi-label"
  );

  // Add a source and layer for the intersection result
  map.addSource("intersection", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer({
    id: "meet-me",
    type: "line",
    source: "intersection",
    layout: {},
    paint: {
      "line-color": "#ffffff",
      "line-opacity": 0.7,
      "line-width": 2,
    },
  });

  map.addSource("places", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer({
    id: "meet-here",
    type: "symbol",
    source: "places",
    layout: {
      "icon-image": isoAppData.params.category + "-15",
      "icon-allow-overlap": true,
    },
    paint: {},
  });

  geocoder.on("result", function (ev) {
    var resultLon = ev.result.geometry.coordinates[0];
    var resultLat = ev.result.geometry.coordinates[1];
    isoAppData.origins.a = [resultLon + 0.01, resultLat + 0.006];
    isoAppData.origins.b = [resultLon - 0.01, resultLat - 0.006];
    // eslint-disable-next-line no-use-before-define
    originA.setLngLat(isoAppData.origins.a);
    // eslint-disable-next-line no-use-before-define
    originB.setLngLat(isoAppData.origins.b);
    getIsos();
  });

  // Once the map is all set up, load some isochrones
  getIsos();
});

map.on("mouseenter", "meet-here", function (e) {
  map.getCanvas().style.cursor = "pointer";

  var coordinates = e.features[0].geometry.coordinates.slice();
  // eslint-disable-next-line xss/no-mixed-html
  var description =
    "<strong>" +
    e.features[0].properties.name +
    "</strong><br><span>" +
    e.features[0].properties.address +
    "</span>";

  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

map.on("mouseleave", "meet-here", function () {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

// Set up the origin markers and their interactivity
var originA = new mapboxgl.Marker({
  draggable: true,
})
  .setLngLat(isoAppData.origins.a)
  .addTo(map);

// When the point is moved, refresh the isochrones
function onDragEndA() {
  var lngLat = originA.getLngLat();
  isoAppData.origins.a = [lngLat.lng, lngLat.lat];
  getIsos();
}

originA.on("dragend", onDragEndA);

var originB = new mapboxgl.Marker({
  draggable: true,
})
  .setLngLat(isoAppData.origins.b)
  .addTo(map);

function onDragEndB() {
  var lngLat = originB.getLngLat();
  isoAppData.origins.b = [lngLat.lng, lngLat.lat];
  getIsos();
}

originB.on("dragend", onDragEndB);

params.addEventListener("change", function (e) {
  if (e.target.name === "profile") {
    isoAppData.params.profile = e.target.value;
    getIsos();
  } else if (e.target.name === "duration") {
    isoAppData.params.minutes = e.target.value;
    getIsos();
  } else if (e.target.name === "category") {
    isoAppData.params.category = e.target.value;
    getIsos();
  }
});
