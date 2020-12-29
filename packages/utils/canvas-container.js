export function getCanvasContainer(id) {
    let canvasContainer = document.querySelector(id);
    if (canvasContainer == null || canvasContainer === null) {
        canvasContainer = document.createElement('canvas');
        canvasContainer.id = id;
        document.body.appendChild(canvasContainer);
    }
    return canvasContainer;
}

