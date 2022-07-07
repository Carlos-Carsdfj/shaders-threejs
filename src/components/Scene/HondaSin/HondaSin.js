import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// Global variables
let currentRef = null
const gui = new dat.GUI({ width: 600 })
// Scene, camera, renderer
const scene = new THREE.Scene()
//scene.background = new THREE.Color(0x8536b)
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 250)
scene.add(camera)
camera.position.set(10, 10, 10)
camera.lookAt(new THREE.Vector3())

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true

renderer.toneMapping = THREE.CineonToneMapping

// cantidad de luz que el toneMapping permita en escena

renderer.setSize(100, 100)

// OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement)

orbitControls.enableDamping = true

// Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight)
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)

// Plane

const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0.0 },
    uFrecuency: { value: 5.0 },
    uAmplitudX: { value: 0.5 },
    uAmplitudZ: { value: 0.5 },
    uColorA: { value: new THREE.Color(0xff0000) },
    uColorB: { value: new THREE.Color(0x0000ff) },
    uColorOffset: { value: 0.0 },
    uColorMult: { value: 1 },
  },

  vertexShader: `
    uniform float uTime;
    uniform float uFrecuency;
    uniform float uAmplitudX;
    uniform float uAmplitudZ;
    varying float vElevationX;
    void main(){
      vec4 modelPosition = modelMatrix * vec4(position, 1);
      float ElevationX = sin(modelPosition.x * uFrecuency + uTime) * uAmplitudX;
      float ElevationZ = sin(modelPosition.z * uFrecuency + uTime) * uAmplitudZ;
      modelPosition.y += ((ElevationX + uAmplitudX) + (ElevationZ + uAmplitudZ));
      gl_Position = projectionMatrix *
                      viewMatrix *
                      modelPosition;
      vElevationX = modelPosition.y;

    }
  `,
  fragmentShader: `
    uniform float uColorOffset;
    uniform float uColorMult;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vElevationX;
    void main(){
      float colorMix = (uColorOffset + vElevationX) * uColorMult;
      vec3 colorC = mix(uColorA, uColorB, colorMix);
      gl_FragColor = vec4(colorC, 1.0);
    }
  `,
})

gui
  .add(planeMaterial.uniforms.uFrecuency, 'value')
  .min(1)
  .max(10)
  .step(0.005)
  .name('Frecuency X-Z')
gui
  .add(planeMaterial.uniforms.uAmplitudZ, 'value')
  .min(0.0)
  .max(1.0)
  .step(0.005)
  .name('Amplitud Z')
gui
  .add(planeMaterial.uniforms.uAmplitudX, 'value')
  .min(0.0)
  .max(1.0)
  .step(0.005)
  .name('Amplitud Z')

const debuggerColorMaterial = {
  colorA: 0xff0000,
  colorB: 0x0000ff,
}

gui.addColor(debuggerColorMaterial, 'colorA').onChange(() => {
  planeMaterial.uniforms.uColorA.value.set(debuggerColorMaterial.colorA)
})
gui.addColor(debuggerColorMaterial, 'colorB').onChange(() => {
  planeMaterial.uniforms.uColorB.value.set(debuggerColorMaterial.colorB)
})

gui
  .add(planeMaterial.uniforms.uColorOffset, 'value')
  .min(-0.5)
  .max(0.5)
  .step(0.00001)
  .name('Color Offset')
gui
  .add(planeMaterial.uniforms.uColorMult, 'value')
  .min(0)
  .max(5)
  .step(0.00001)
  .name('Color Mult')

const geometry = new THREE.PlaneBufferGeometry(5, 5, 255, 255)

const plane = new THREE.Mesh(geometry, planeMaterial)
plane.rotation.x = Math.PI * -0.5

scene.add(plane)

// Arrow helper
const origin = new THREE.Vector3(0, 0, 0)
const length = 4

const dirX = new THREE.Vector3(2, 0, 0)
dirX.normalize()
const arrowHelperX = new THREE.ArrowHelper(dirX, origin, length, 0x0000ff)
scene.add(arrowHelperX)

const dirZ = new THREE.Vector3(0, 0, 2)
dirZ.normalize()
const arrowHelperZ = new THREE.ArrowHelper(dirZ, origin, length, 0xff0000)
scene.add(arrowHelperZ)

//Grid helper
const size = 10
const divisions = 10

// Axes helper

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper(size, divisions)
scene.add(gridHelper)

// Animate the scene
const animate = () => {
  planeMaterial.uniforms.uTime.value += 0.01

  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

export const initScene = (mountRef) => {
  currentRef = mountRef.current
  resize()
  currentRef.appendChild(renderer.domElement)
}

// Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  gui.destroy()
  scene.removeFromParent()
  currentRef.removeChild(renderer.domElement)
}
