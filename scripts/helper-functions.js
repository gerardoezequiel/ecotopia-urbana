export const getLabelLayerId = (layers) => {
  const { id: labelLayerId } = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout['text-field'],
  );

  return labelLayerId;
};
