import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const canvas = document.getElementById('3dCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const controls = new OrbitControls( camera, renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const modelUrl = 'MaleCharBaseMesh.gltf';

loader.load(modelUrl, (gltf) => {
    scene.add(gltf.scene);
    console.log('3D model loaded:', gltf);
}, undefined, (error) => {
    console.error('Error loading 3D model:', error);
});

const animate = () => {
    requestAnimationFrame(animate);

    // Add any animation or interaction logic here

    renderer.render(scene, camera);
};

animate();
