const THREE = require('three');
import {
    GamepadControls
} from './controller-gamepad';

function getControllers(renderer, onSelectStart, onSelectEnd) {
    let controllerOne = renderer.xr.getController(0);
    let controllerButtons = null;
    const temp = new THREE.Matrix4();
    controllerOne.addEventListener('connected', function (event) {
        this.add(buildController(event.data));
        controllerOne.gp = GamepadControls(event, controllerOne);
        // controllerOne.addEventListener('axesChange',(e) => console.log(e.message));
        // controllerOne.addEventListener('axesChange',(e) => console.log('hryyy',e.message));
        // controllerOne.addEventListener('triggerDown',(e)=> console.log('t=down'));
        // controllerOne.addEventListener('triggerUp',(e)=> console.log('t=up'));
        // controllerOne.addEventListener('squeezeUp',(e)=> console.log('s=up'));
        // controllerOne.addEventListener('squeezeDown',(e)=> console.log('s=down'));
        // controllerOne.addEventListener('squeezeDown',(e)=> console.log('s-down'));
        function logger(e){
            console.log('trigger-up')
        }
        // controllerOne.gp.trigger.addEventListener('up', logger);
        // controllerOne.gp.squeeze.addEventListener('up', (e) => console.log('squeeze-up'));
        // controllerOne.gp.xora.addEventListener('up', (e) => controllerOne.gp.trigger.removeEventListener('up', logger));
        // controllerOne.gp.trigger.addEventListener('up', (e) => console.log(e.type));
        // controllerOne.gp.trigger.addEventListener('touchStart', (e) => console.log(e.type))
        controllerOne.gp.trigger.addEventListener('down', (e) => {
            temp.identity().extractRotation(controllerOne.matrixWorld);
            onSelectStart(controllerOne);
        });
        // controllerOne.gp.trigger.addEventListener('touchEnd', (e) => console.log(e));

    });

    controllerOne.addEventListener('disconnected', function () {
        this.remove(this.children[0]);
    });

    controllerOne.addEventListener('selectstart', () => {
        console.log(controllerButtons);
        // controllerButtons[0]=90;
    });

    controllerOne.addEventListener('selectend', onSelectEnd);

    window.controllerOne = controllerOne;
    return controllerOne;

}

function buildController(data) {
    let geometry, material;
    switch (data.targetRayMode) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)); //wutt
            geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 5, 0, 0, 0], 3));

            material = new THREE.LineBasicMaterial({
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                color: 0x090000
            });

            return new THREE.Line(geometry, material);

        case 'gaze':

            geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, -1);
            material = new THREE.MeshBasicMaterial({
                opacity: 0.5,
                transparent: true
            });
            return new THREE.Mesh(geometry, material);

    }
}




export default getControllers;