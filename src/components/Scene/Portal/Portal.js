import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vertex } from './Vertex'
import { Fragment } from './Fragment'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Global variables
let currentRef = null

// Scene, camera, renderer
const scene = new THREE.Scene()
//scene.background = new THREE.Color(0x8536b)
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 250)
scene.add(camera)
camera.position.set(30, 20, 30)
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
orbitControls.target.set(0, 5, 0)

// Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight)
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)

// Plane
//const mountain = new THREE.TextureLoader().load('./mountain.png')
const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0.0 },
  },
  vertexShader: Vertex,
  fragmentShader: Fragment,
})

const geometry = new THREE.PlaneBufferGeometry(5, 5, 500, 500)

const plane = new THREE.Mesh(geometry, planeMaterial)

scene.add(plane)

//load model
const gltfLoader = new GLTFLoader()

gltfLoader.load('./Portal.gltf', (gltf) => {
  scene.add(gltf.scene)
})

//lights
const DirectionalLight = new THREE.DirectionalLight(0xffffff, 3)
DirectionalLight.position.set(20, 20, 20)
scene.add(DirectionalLight)

const ao = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ao)

const envMap = new THREE.CubeTextureLoader().load([
  './hdri/px.png',
  './hdri/nx.png',
  './hdri/py.png',
  './hdri/ny.png',
  './hdri/pz.png',
  './hdri/nz.png',
])
scene.environment = envMap

// Animate the scene
const animate = () => {
  planeMaterial.uniforms.uTime.value += 0.1
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
  //  gui.destroy()
  scene.removeFromParent()
  currentRef.removeChild(renderer.domElement)
}
