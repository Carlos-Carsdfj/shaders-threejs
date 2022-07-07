import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vertex } from './Vertex'
import { Fragment } from './Fragment'

// Global variables
let currentRef = null
//const gui = new dat.GUI({ width: 600 })
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
plane.rotation.x = Math.PI * -0.5

scene.add(plane)

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
  planeMaterial.uniforms.uTime.value += 0.03
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
