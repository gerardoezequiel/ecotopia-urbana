//Query for the pop-up information
export const addOtmPopUp = ({ apiGet, onShowPOI, map }) => {
  //Open trip map
  const apiKey = '5ae2e3f221c38a28845f05b6ed0662748f2fdf24cede18cf28fcee8a';

  const apiGet = async (method, query) => {
    const url =
      query !== undefined
        ? `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${apiKey}&${query}`
        : `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${apiKey}`;

    const response = await fetch(url);
    return await response.json();
  };

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
    const popup = document.getElementsByClassName('mapboxgl-popup');
    if (popup.length) {
      popup[0].remove();
    }
  }
  map.on('mouseenter', 'opentripmap-pois', function (e) {
    map.getCanvas().style.cursor = 'pointer';
    var coordinates = e.features[0].geometry.coordinates.slice();
    var id = e.features[0].properties.id;
    var name = e.features[0].properties.name;

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
};
