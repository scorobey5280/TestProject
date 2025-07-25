import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.177.0/build/three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import * as BufferGeometryUtils from './BufferGeometryUtils.js';


const burger = document.getElementById('burger-btn');
const sidepanel = document.getElementById('sidepanel');
if (burger && sidepanel) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    sidepanel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!sidepanel.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove('open');
      sidepanel.classList.remove('open');
    }
  });
}

let scene, camera, renderer, raycaster, mouse;
let clickableAreas = [];
let label = document.getElementById('label');
const container = document.getElementById('three-container');

let mixer = null;
let bananaAction = null;
let animationReversed = true;
let isAnimating = false;
const clock = new THREE.Clock();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 2, 7);
  camera.lookAt(0, 1, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Orbit-like camera drag
  let isDragging = false, prevX, prevY, theta = 0, phi = 0;
  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });
  renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
      theta -= (e.clientX - prevX) * 0.01;
      phi += (e.clientY - prevY) * 0.01;
      phi = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, phi));
      camera.position.x = 7 * Math.sin(theta) * Math.cos(phi);
      camera.position.y = 7 * Math.sin(phi) + 2;
      camera.position.z = 7 * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(0, 1, 0);
      prevX = e.clientX;
      prevY = e.clientY;
    }
  });
  renderer.domElement.addEventListener('mouseup', () => isDragging = false);
  renderer.domElement.addEventListener('mouseleave', () => isDragging = false);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const loader = new GLTFLoader();


// Load Banana (animated)
loader.load('./model/Banana.glb', function (gltf) {
  const banana = gltf.scene;
  banana.position.set(0, 0, 0); // optional positioning
  scene.add(banana);
  
   banana.traverse((child) => {
    if (child.isMesh) {
      clickableAreas.push(child);
      // Optional: set custom label for feedback
      child.userData = { label: 'BananaModel' };
    }
  });
  
  console.log('Animations in Banana.glb:', gltf.animations);
  
   mixer = new THREE.AnimationMixer(banana);

  if (gltf.animations.length > 0) {
    bananaAction = mixer.clipAction(gltf.animations[0]);
    bananaAction.setLoop(THREE.LoopOnce);
    bananaAction.clampWhenFinished = true;
  }
});

// Load Phone (static)
loader.load('./model/Phone.glb', function (gltf) {
  const phone = gltf.scene;
  phone.position.set(0, 0, 0); // optional positioning
  scene.add(phone);
  
   phone.traverse((child) => {
    if (child.isMesh) {
      clickableAreas.push(child);
      // Optional: set custom label for feedback
      child.userData = { label: 'PhoneModel' };
    }
  });
});

    const areaData = [
      { position: new THREE.Vector3(0, 2, 0), text: "Banana" },
      { position: new THREE.Vector3(2, 0, 0), text: "BananaPhone" },
      { position: new THREE.Vector3(0, 0, 1.9), text: "Phone" }
    ];

    areaData.forEach((area) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.0, transparent: true })
      );
      sphere.position.copy(area.position);
      sphere.userData = { label: area.text };
      clickableAreas.push(sphere);
      scene.add(sphere);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 24px Arial';
      const textWidth = ctx.measureText(area.text).width;
      canvas.width = textWidth + 20;
      canvas.height = 40;
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 4;
      ctx.strokeText(area.text, 10, 28);
      ctx.fillText(area.text, 10, 28);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1.5, 0.4, 1);
      sprite.position.copy(area.position.clone().add(new THREE.Vector3(0, 0.25, 0)));
      scene.add(sprite);
    });


  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('click', onClick);

  animate();
}

function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableAreas, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    label.textContent = intersect.object.userData.label;
    label.classList.add('visible');

    const pos = intersect.object.position.clone();
    pos.project(camera);
    const x = (pos.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-pos.y * 0.5 + 0.5) * container.clientHeight;
    label.style.left = (container.offsetLeft + x) + 'px';
    label.style.top = (container.offsetTop + y) + 'px';
  } else {
    label.classList.remove('visible');
  }
}

function onClick(event) {
  if (isAnimating || !bananaAction) return; // Prevent overlapping animations

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableAreas, false);

  if (intersects.length > 0) {
    isAnimating = true; // Block further clicks

    animationReversed = !animationReversed;
    bananaAction.paused = false;
    bananaAction.timeScale = animationReversed ? -1 : 1;
    bananaAction.time = animationReversed
      ? bananaAction.getClip().duration
      : 0;

    bananaAction.play();

    // Set a listener for when the animation ends
    mixer.addEventListener('finished', () => {
      isAnimating = false; // Allow new animation
    });
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}

init();