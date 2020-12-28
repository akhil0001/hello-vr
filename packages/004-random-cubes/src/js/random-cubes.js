import {
    random
} from 'lodash';
const THREE = require('three');


export function addRandomCubes(scene, numberOfCubes = 1000) {
    const _num = numberOfCubes;
    let cubes = [];
    for (let i = 0; i < _num; i++) {

        const randomColor = `hsl(${random(0,360)},${random(25,100)}%, 35%)`;
        const cube = createCube({
            color: randomColor,
            x: random(-20, 20),
            y: random(-30, 30),
            z: random(-15, 15),
            width: 1
        });
        scene.add(cube);
        cubes.push(cube);
    }

    return cubes;

}

function createCube({
    color,
    x,
    y,
    z,
    width
}) {
    const BoxWidth =width;
    const geometry = new THREE.BoxGeometry(BoxWidth,BoxWidth,BoxWidth);
    const material = new THREE.MeshPhongMaterial({
        emissive: color
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);

    return cube;
}