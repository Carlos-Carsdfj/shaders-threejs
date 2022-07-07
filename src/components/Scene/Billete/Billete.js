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
const billete = new THREE.TextureLoader().load('./billete.jpg')
const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0.0 },
    uBillete: { value: billete },
  },

  vertexShader: `
    varying vec2 uVu;
    uniform float uTime;
    void main(){
      vec4 modelPosition = modelMatrix * vec4(position, 1);
      modelPosition.y = sin(modelPosition.x * 8.5 + uTime) * 0.05;
      gl_Position = projectionMatrix *
                      viewMatrix *
                      modelPosition;
      uVu = uv;                
    }
  `,
  fragmentShader: `
  uniform sampler2D uBillete;
    varying vec2 uVu;
    void main(){
      vec4 billeteTexture = texture2D(uBillete, vec2(uVu.x, uVu.y));
      gl_FragColor = billeteTexture;
    }
  `,
})

const geometry = new THREE.PlaneBufferGeometry(5, 2, 100, 100)

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
