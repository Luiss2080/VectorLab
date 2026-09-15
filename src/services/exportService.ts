import { Shape } from '../store/useCanvasStore';

export const exportToJSON = (shapes: Shape[]) => {
  const data = JSON.stringify(shapes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lienzo.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToSVG = () => {
  const svgEl = document.querySelector('svg');
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgEl);
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lienzo.svg';
  a.click();
  URL.revokeObjectURL(url);
};
