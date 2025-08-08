import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( 0, 0, 5 );
camera.lookAt( 0, 0, 0 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointsA = [];
for (let i = 0; i <= Math.PI * 2; i+= 0.01) {
    pointsA.push(new THREE.Vector3(Math.cos(i), Math.sin(i), 0));
}

const geometryA = new THREE.BufferGeometry().setFromPoints( pointsA );
const materialA = new THREE.LineBasicMaterial( { color: 0xf91616 } );
const lineA = new THREE.Line( geometryA, materialA );
scene.add( lineA );

const pointsB = [];
for (let i = 0; i <= Math.PI * 2; i+= 0.01) {
    pointsB.push(new THREE.Vector3(Math.cos(i) * 3, Math.sin(i) * 3, 0));
}

const geometryB = new THREE.BufferGeometry().setFromPoints( pointsB );
const materialB = new THREE.LineBasicMaterial( { color: 0xf51111 } );
const lineB = new THREE.Line( geometryB, materialB );
scene.add( lineB );



renderer.render(scene, camera);