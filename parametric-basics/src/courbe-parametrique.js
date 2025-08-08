import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointsA = [];
for (let t = 0; t < 100; t += 0.01) {
    pointsA.push(new THREE.Vector3(Math.pow(Math.sin(t), 3), Math.cos(t) - Math.pow(Math.cos(t), 4), 0));
}

const geometryA = new THREE.BufferGeometry().setFromPoints(pointsA);
const materialA = new THREE.LineBasicMaterial({ color: 0xf91616 });
const lineA = new THREE.Line(geometryA, materialA);
scene.add(lineA);

renderer.render(scene, camera);