const THREE = require('three');
export function initRenderer(canvasEl, {
    width,
    height
}) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasEl
    });
    renderer.xr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    return renderer;
}