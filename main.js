import "./style.css";
import * as THREE from "three";
import normalMap from "./images/NormalMap.png";
import space12 from "./images/space12.png";
import avatar from "./images/avatar3.png";
import earth3 from "./images/earth3.jpg";
import normal from "./images/normal.jpg";
import moon22 from "./images/moon.jpg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

window.onload = () => {
  document.querySelector(".loading").classList.toggle("loading");
  document.getElementsByClassName("lds-facebook")[0].remove();
};

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus
const torusTexture = new THREE.TextureLoader().load(normalMap);

const geometry = new THREE.TorusKnotGeometry(20, 1, 55, 3, 20, 11);
const material = new THREE.MeshStandardMaterial({ color: 0x0288d1 });
material.normalMap = torusTexture;
material.metalness = 0.4;
material.roughness = 1;
// material.wireframe = true;
material.flatShading = true;
material.transparent = true;
material.opacity = 0.6;
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0x1579b);
pointLight.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.TetrahedronGeometry(0.2, 2, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  material.metalness = 0.5;
  material.roughness = 1;
  material.opacity = 0.5;

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load(space12);
scene.background = spaceTexture;

// Avatar

const krisTexture = new THREE.TextureLoader().load(avatar);

const kris = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3.5),
  new THREE.MeshBasicMaterial({ map: krisTexture })
);

scene.add(kris);

// Moon

const moonTexture = new THREE.TextureLoader().load(earth3);
const normalTexture = new THREE.TextureLoader().load(normal);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
// Moon 2

const moon2Texture = new THREE.TextureLoader().load(moon22);
// const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon2 = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moon2Texture,
    normalMap: normalTexture,
  })
);

scene.add(moon2);

function avatarPosition(mediaQuery) {
  if (mediaQuery.matches) {
    kris.position.z = -7;
    kris.position.x = 0;
    kris.position.y = 2.5;
  } else {
    kris.position.z = -5;
    kris.position.x = 2;
  }
}
const mediaQuery = window.matchMedia("(max-width: 420px)");
avatarPosition(mediaQuery);

moon2.position.z = 30;
moon2.position.setX(-30);

moon.position.z = 30;
moon.position.setX(-10);

// kris.position.z = -5;
// kris.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.055;
  moon.rotation.y += 0.0575;
  moon.rotation.z += 0.055;

  moon2.rotation.x += 0.055;
  moon2.rotation.y += 0.0575;
  moon2.rotation.z += 0.055;

  kris.rotation.x += 0.005;
  kris.rotation.y += 0.001;
  kris.rotation.z += 0.001;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.0001;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  kris.rotation.x += 0.005;

  moon2.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
