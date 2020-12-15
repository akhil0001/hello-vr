const THREE = require('three');

function getControllers(renderer,onSelectStart,onSelectEnd) {
    const controllerOne = renderer.xr.getController(0);
   
    controllerOne.addEventListener('connected',function(event){
        this.add(buildController(event.data))
    });

    controllerOne.addEventListener('disconnected',function() {
        this.remove(this.children[0]);
    });

    controllerOne.addEventListener('selectstart',onSelectStart);

    controllerOne.addEventListener('selectend',onSelectEnd);

    return controllerOne;

}

function buildController(data){
    let geometry, material;

    switch ( data.targetRayMode ) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) ); //wutt
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 5, 0, 0, 0 ], 3 ) );

            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending,color:0x090000 } );

            return new THREE.Line( geometry, material );

        case 'gaze':

            geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }

}

export default getControllers;