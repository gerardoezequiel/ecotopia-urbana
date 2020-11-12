export const addIsoChrone = async ({
  map,
  marker,
  getIso,
  longitude,
  latitude,
}) => {
  map.addSource('iso', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  map.addLayer(
    {
      id: 'isoLayer',
      type: 'fill',
      source: 'iso',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': '#5a3fc0',
        'fill-opacity': 0.3,
      },
    },
    'poi-label',
  );

  marker.setLngLat({ lon: longitude, lat: latitude }).addTo(map);
  await getIso();
};
