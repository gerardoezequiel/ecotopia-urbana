import { getLabelLayerId } from './helper-functions.js';

export const addBuildingLayer = (map) => {
  // Insert the layer beneath any symbol layer.
  const layers = map.getStyle().layers;

  const labelLayerId = getLabelLayerId(layers);
  map.doubleClickZoom.disable();
  map.addLayer(
    {
      id: '3D Buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 10,
      paint: {
        'fill-extrusion-color': 'rgba(221, 217, 217, 0.582)',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.9,
      },
    },
    labelLayerId,
  );
};
