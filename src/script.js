import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Vector3 } from "three";
import { gsap } from "gsap";
import { createLabel , InitLabels} from './labael'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()
const gui = new GUI
gui.hide()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
let lableAnimation = {
    active: false,
    x: 0,
    y: 0,
    z: 0
};

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) => {
        if(child.isMesh && child.material.name.includes('glass')) {
            child.material.transmission = 1 ; // Make it transparent
            child.material.opacity = .4; // Required for transmission
            // child.material.metalness = 0;
            // child.material.roughness = 0; // Make it smooth
            child.material.ior = 1; // Glass IOR
            // child.material.thickness = 0.1; // Glass thickness
            child.material.transparent = true;
            child.material.needsUpdate = true;
        }
        
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}


/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = .65
gui
    .add(scene, 'environmentIntensity')
    .min(0)
    .max(10)
    .step(0.001)

// HDR (RGBE) equirectangular

rgbeLoader.load('/environmentMaps/studio_small_09_2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = new THREE.TextureLoader().load('backgorund.png')
    scene.environment = environmentMap
})

/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', .9)
directionalLight.position.set(- 8, 6.5, 2.5)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(- 10).max(10).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 10).max(10).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 10).max(10).step(0.001).name('lightZ')

// Shadows
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 25
directionalLight.shadow.normalBias = 0.019
directionalLight.shadow.bias = - 0.001
directionalLight.shadow.mapSize.set(1024, 1024)

gui.add(directionalLight, 'castShadow')
gui.add(directionalLight.shadow, 'normalBias').min(- 0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(- 0.05).max(0.05).step(0.001)

// Target
directionalLight.target.position.set(0, 0, 0)
directionalLight.target.updateWorldMatrix()

// // Helper
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

/**
 * Models
 */

const brownTexture = new THREE.TextureLoader().load('/models/watch/ulysse_watch_basecolor_2.png'); 
const blueTexture = new THREE.TextureLoader().load('/models/watch/ulysse_watch_basecolor.png'); 

blueTexture.flipY = false
blueTexture.colorSpace = THREE.SRGBColorSpace; 
brownTexture.flipY = false
brownTexture.colorSpace = THREE.SRGBColorSpace; 


gltfLoader.load(
    '/models/watch/Ulysse_Nardin_Watch.gltf',
    (gltf) =>
    {
        let watchMaterials;
        gltf.scene.traverse((child) => {
            if (child.name == 'watch'){
                watchMaterials = child;
            }
            console.log(child)
        });
        if (watchMaterials) {
            watchMaterials.material.map = blueTexture;
        }
        console.log(watchMaterials.material.map)

        gltf.scene.scale.set(.5, .5, .5)
        scene.add(gltf.scene)
        
        const blueButton = document.querySelector('#blue-watch')
        const brownButton = document.querySelector('#brown-watch')

        if (blueButton && brownButton) {
            blueButton.addEventListener('click',()=>{
                watchMaterials.material.map = blueTexture;
            })
            brownButton.addEventListener('click',()=>{
                watchMaterials.material.map = brownTexture; 
            })
        }
        updateAllMaterials();
    }
)

/**
 * Look at function
 */
function animateCamera(camera, targetPosition, targetLookAt, duration = 2, ease = "power2.inOut") {
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        camera.lookAt(targetLookAt);
      },
      onComplete: () => {
        lableAnimation.active = true
      }
    });
}


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4.12, 5, 4.79)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
// Add this after your GUI initialization
const cameraPositions = {
    savePosition: () => {
        const position = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
            targetY: controls.target.y // Save OrbitControls target too
        };
        // Save to localStorage
        localStorage.setItem('cameraPosition', JSON.stringify(position));
        console.log('Camera position saved:', position);
    },
    loadPosition: () => {
        const savedPosition = localStorage.getItem('cameraPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            const targetPosition = new Vector3(position.x,  position.y, position.z);
            const targetLookAt = new Vector3(0, 0, 0);
        
            animateCamera(camera, targetPosition, targetLookAt);
        }
    }

};

// Add buttons to GUI
const cameraFolder = gui.addFolder('Camera Positions');
cameraFolder.add(cameraPositions, 'savePosition').name('Save Position');
cameraFolder.add(cameraPositions, 'loadPosition').name('Load Position');
// Add current position display
const cameraDebug = {
    x: 0,
    y: 0,
    z: 0
};

cameraFolder.add(cameraDebug, 'x').listen();
cameraFolder.add(cameraDebug, 'y').listen();
cameraFolder.add(cameraDebug, 'z').listen();


//add label
let labels = [];
InitLabels.forEach((label , index) => {
    const newLabel = createLabel(index + 1,'tytul','opis ospisdandsa',label.descriptionPositon);
    newLabel.position.set(label.x, label.y, label.z)
    newLabel.name = ( index + 1).toString()
    newLabel.cameraPosition = label.cameraPosition
    labels.push(newLabel);
    scene.add(newLabel);
}); 
// labels[0] = createLabel('Moja adnotacja');
// labels[0].position.set(10, 2, 0); // Ustaw pozycję w scenie
// scene.add(labels[0]);

const labelWidth = 1;  
const labelHeight = 1; 

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// add move to addnotations 
function onMouseClick(event) {
    mouse.x = (event.clientX /  window.innerWidth ) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Sprawdź przecięcia z obiektami etykiet
    const intersects = raycaster.intersectObjects(labels, true);
    let clickedLabel;

    if (intersects.length > 0) {

        intersects.forEach((el)=>{
            if( el.object.name){
                clickedLabel = el.object
                return
            }
        })
    }

    if (clickedLabel) {
  
        //  clickedLabel = intersects[0].object; // Najbliższa trafiona etykieta
        console.log(clickedLabel)
        const square = clickedLabel.children.find((child) => child.isMesh);
        if(square){
            square.visible = true
        } 
        
        const targetPosition = new Vector3(clickedLabel.cameraPosition.x,  clickedLabel.cameraPosition.y, clickedLabel.cameraPosition.z);
        const targetLookAt = new Vector3(clickedLabel.position.x, clickedLabel.position.y, clickedLabel.position.z);
        animateCamera(camera, targetPosition, targetLookAt);
    }
}

window.addEventListener('click', onMouseClick);

const tick = () =>   
{
    // Update camera position display
    cameraDebug.x = Number(camera.position.x.toFixed(2));
    cameraDebug.y = Number(camera.position.y.toFixed(2));
    cameraDebug.z = Number(camera.position.z.toFixed(2));
    // Update controls
    controls.update()

 
    let activeLabel = true;
    labels.forEach((label)=>{
        const distance = camera.position.distanceTo(label.position);
        const scale = distance * 0.05;
        
        // Scale the label container
        label.scale.set(labelWidth * scale, labelHeight * scale, 1);
        
        // Make the label face the camera
        label.lookAt(camera.position);
        
        const square = label.children.find((child) => child.isMesh);
        if (square) {
            // console.log(camera.position.x.toFixed(2), label.cameraPosition.x)
          if(
            lableAnimation.active &&
            camera.position.x.toFixed(2) == label.cameraPosition.x &&
            camera.position.y.toFixed(2) == label.cameraPosition.y &&
            camera.position.z.toFixed(2) == label.cameraPosition.z 
          ){
            // square.visible = true
            label.visible = true

          }else{
            square.visible = false
            label.visible = false
            // label.visible = true
          }

          if(
            camera.position.x.toFixed(2) == label.cameraPosition.x &&
            camera.position.y.toFixed(2) == label.cameraPosition.y &&
            camera.position.z.toFixed(2) == label.cameraPosition.z
            ){
                activeLabel = false
            }

        }
    })
    if(activeLabel){
        labels.forEach((label)=>{
            label.visible = true
        })
        lableAnimation.active = false
    }
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


