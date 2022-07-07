import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//import * as dat from 'dat.gui'
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
const mountain = new THREE.TextureLoader().load('./mountain.png')
const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0.0 },
    uMountain: { value: mountain },
  },

  vertexShader: `
    uniform sampler2D uMountain;   
    varying float vElevation;
    void main(){
      vec4 modelPosition = modelMatrix * vec4(position, 1);
      vec4 displacement = texture2D(uMountain, uv);
      modelPosition.y = displacement.r * 2.0 ;
      gl_Position = projectionMatrix *
                      viewMatrix *
                      modelPosition;
      vElevation = modelPosition.y;      
    }
  `,
  fragmentShader: `
    varying float vElevation;
    uniform float uTime;
    void main(){
      float colorMix = sin(vElevation + uTime * 2.0);
      vec4 colorA = vec4(1.0, 0.0, 0.0, 1.0);
      vec4 colorB = vec4(1.0, 1.0, 1.0, 1.0);
      vec4 colorC = mix(colorA, colorB, colorMix);
      gl_FragColor = colorC;
    }
  `,
})

const geometry = new THREE.PlaneBufferGeometry(5, 5, 250, 250)

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
  planeMaterial.uniforms.uTime.value += 0.02
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
