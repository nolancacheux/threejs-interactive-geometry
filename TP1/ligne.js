import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointsA = [];
pointsA.push( new THREE.Vector3( - 10, 0, 0 ) );
pointsA.push( new THREE.Vector3( - 10, 10, 0 ) );
pointsA.push( new THREE.Vector3( 0, 10, 0 ) );
pointsA.push( new THREE.Vector3( - 10, 0, 0 ) );

const geometryA = new THREE.BufferGeometry().setFromPoints( pointsA );
const materialA = new THREE.LineBasicMaterial( { color: 0x00d800 } );
const lineA = new THREE.Line( geometryA, materialA );
scene.add( lineA );

const pointsB = [];
pointsB.push( new THREE.Vector3( 0, 0, 0 ) );
pointsB.push( new THREE.Vector3( 10, 10, 0 ) );
pointsB.push( new THREE.Vector3( 20, 0, 0 ) );

const pointsC = [];
pointsC.push( new THREE.Vector3( 5, 5, 0 ) );
pointsC.push( new THREE.Vector3( 15, 5, 0 ) );

const geometryB = new THREE.BufferGeometry().setFromPoints( pointsB );
const geometryC = new THREE.BufferGeometry().setFromPoints( pointsC );
const materialB = new THREE.LineBasicMaterial( { color: 0xff00e1 } );
const lineB = new THREE.Line( geometryB, materialB );
const lineC = new THREE.Line( geometryC, materialB );
scene.add( lineB );
scene.add( lineC );


renderer.render(scene, camera);