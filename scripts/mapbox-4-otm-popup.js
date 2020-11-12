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
