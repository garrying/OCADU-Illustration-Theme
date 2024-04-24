import THREE from 'three.js'
import gsap from 'gsap'
import VirtualScroll from 'virtual-scroll'

let ww = document.getElementById('title').offsetWidth
let wh = document.getElementById('title').offsetHeight

const isFirefox = navigator.userAgent.indexOf('Firefox') > -1
const isWindows = navigator.appVersion.indexOf('Win') != -1

const mouseMultiplier = 0.6
const firefoxMultiplier = 20

const multipliers = {
  mouse: isWindows ? mouseMultiplier * 2 : mouseMultiplier,
  firefox: isWindows ? firefoxMultiplier * 2 : firefoxMultiplier
}

/** CORE **/
class Core {
  constructor() {
    this.tx = 0
    this.ty = 0
    this.cx = 0
    this.cy = 0

    this.diff = 0

    this.wheel = { x: 0, y: 0 }
    this.on = { x: 0, y: 0 }
    this.max = { x: 0, y: 0 }

    this.isDragging = false

    this.tl = gsap.timeline({ paused: true })

    this.el = document.querySelector('.js-grid')

    /** GL specifics **/
    this.scene = new THREE.Scene()

    this.camera = new THREE.OrthographicCamera(
      ww / -2,
      ww / 2,
      wh / 2,
      wh / -2,
      1,
      1000
    )
    this.camera.lookAt(this.scene.position)
    this.camera.position.z = 1

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(ww, wh)
    this.renderer.setPixelRatio(
      gsap.utils.clamp(1, 1.5, window.devicePixelRatio)
    )

    document.getElementById('title').appendChild(this.renderer.domElement)
    /** Gl specifics end **/

    this.addPlanes()
    this.addEvents()
    this.resize()
  }

  addEvents() {
    gsap.ticker.add(this.tick)

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('wheel', this.onWheel)
    window.addEventListener('resize', this.resize)
  }

  addPlanes() {
    const planes = [...document.querySelectorAll('.js-plane')]

    this.planes = planes.map((el, i) => {
      const plane = new Plane()
      plane.init(el, i)

      this.scene.add(plane)

      return plane
    })
  }

  tick = () => {
    const xDiff = this.tx - this.cx
    const yDiff = this.ty - this.cy

    this.cx += xDiff * 0.085
    this.cx = Math.round(this.cx * 100) / 100

    this.cy += yDiff * 0.085
    this.cy = Math.round(this.cy * 100) / 100

    this.diff = Math.max(Math.abs(yDiff * 0.0001), Math.abs(xDiff * 0.0001))

    this.planes.length &&
      this.planes.forEach((plane) =>
        plane.update(this.cx, this.cy, this.max, this.diff)
      )

    this.renderer.render(this.scene, this.camera)
  }

  onMouseMove = ({ clientX, clientY }) => {
    if (!this.isDragging) return

    this.tx = this.on.x + clientX * 2.5
    this.ty = this.on.y - clientY * 2.5
  }

  onMouseDown = ({ clientX, clientY }) => {
    if (this.isDragging) return

    this.isDragging = true

    this.on.x = this.tx - clientX * 2.5
    this.on.y = this.ty + clientY * 2.5
  }

  onMouseUp = ({ clientX, clientY }) => {
    if (!this.isDragging) return

    this.isDragging = false
  }

  onWheel = (e) => {
    const { mouse, firefox } = multipliers

    this.wheel.x = e.wheelDeltaX || e.deltaX * -1
    this.wheel.y = e.wheelDeltaY || e.deltaY * -1

    if (isFirefox && e.deltaMode === 1) {
      this.wheel.x *= firefox
      this.wheel.y *= firefox
    }

    this.wheel.y *= mouse
    this.wheel.x *= mouse

    this.tx += this.wheel.x
    this.ty -= this.wheel.y
  }

  resize = () => {
    ww = document.getElementById('title').offsetWidth
    wh = document.getElementById('title').offsetHeight

    const { bottom, right } = this.el.getBoundingClientRect()

    this.max.x = right
    this.max.y = bottom
  }
}

/** PLANE **/
const loader = new THREE.TextureLoader()

const vertexShader = `
precision mediump float;

uniform float u_diff;

varying vec2 vUv;

void main(){
  vec3 pos = position;
  
  pos.y *= 1. - u_diff;
  pos.x *= 1. - u_diff;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);;
}
`

const fragmentShader = `
precision mediump float;

uniform vec2 u_res;
uniform vec2 u_size;

uniform sampler2D u_texture;

vec2 cover(vec2 screenSize, vec2 imageSize, vec2 uv) {
  float screenRatio = screenSize.x / screenSize.y;
  float imageRatio = imageSize.x / imageSize.y;

  vec2 newSize = screenRatio < imageRatio 
      ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
      : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
  vec2 newOffset = (screenRatio < imageRatio 
      ? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
      : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;

  return uv * screenSize / newSize + newOffset;
}

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec2 uvCover = cover(u_res, u_size, uv);
    vec4 texture = texture2D(u_texture, uvCover);
	
    gl_FragColor = texture;
}
`

const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader
})

class Plane extends THREE.Object3D {
  init(el, i) {
    this.el = el

    this.x = 0
    this.y = 0

    this.my = 1 - (i % 5) * 0.1

    this.geometry = geometry
    this.material = material.clone()

    this.material.uniforms = {
      u_texture: { value: 0 },
      u_res: { value: new THREE.Vector2(1, 1) },
      u_size: { value: new THREE.Vector2(1, 1) },
      u_diff: { value: 0 }
    }

    this.texture = loader.load(this.el.dataset.src, (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.generateMipmaps = false

      const { naturalWidth, naturalHeight } = texture.image
      const { u_size, u_texture } = this.material.uniforms

      u_texture.value = texture
      u_size.value.x = naturalWidth
      u_size.value.y = naturalHeight
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)

    this.resize()
  }

  update = (x, y, max, diff) => {
    const { right, bottom } = this.rect
    const { u_diff } = this.material.uniforms

    this.y =
      gsap.utils.wrap(-(max.y - bottom), bottom, y * this.my) - this.yOffset

    this.x = gsap.utils.wrap(-(max.x - right), right, x) - this.xOffset

    u_diff.value = diff

    this.position.x = this.x
    this.position.y = this.y
  }

  resize() {
    this.rect = this.el.getBoundingClientRect()

    const { left, top, width, height } = this.rect
    const { u_res, u_toRes, u_pos, u_offset } = this.material.uniforms

    this.xOffset = left + width / 2 - ww / 2
    this.yOffset = top + height / 2 - wh / 2

    this.position.x = this.xOffset
    this.position.y = this.yOffset

    u_res.value.x = width
    u_res.value.y = height

    this.mesh.scale.set(width, height, 1)
  }
}

new Core()
