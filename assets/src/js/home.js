import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(Draggable, InertiaPlugin)

const CARD_WIDTH = 300
const PAIR_WIDTH = CARD_WIDTH * 2
const STRIPE_MIN_HEIGHT = 8000
const WIDE_RATIO = 1.3
const MIN_SCALE = 0.15
const MAX_SCALE = 1.0
const clampScale = gsap.utils.clamp(MIN_SCALE, MAX_SCALE)

function LoadJSON(callback) {
  const jsonData = JSON.parse(document.getElementById('image-data').textContent)
  callback(jsonData)
}

class Card {
  constructor(descriptor, width, height) {
    this.descriptor = descriptor
    this.width = width
    this.height = height
    this.createDOMElement()
    this.x = 0
    this.y = 0
    this.scale = 1
    this._lastW = 0
    this._lastH = 0
    this.revealCall = null
    this.loadEpoch = 0
  }

  createDOMElement() {
    this.rootElement = document.createElement('div')
    this.imgElement = document.createElement('img')
    this.imgElement.decoding = 'async'
    this.rootElement.className = 'card card-loading'
    this.rootElement.appendChild(this.imgElement)
    this.anchorElement = document.createElement('a')
    this.anchorElement.className = 'w-full h-full block'
    this.rootElement.appendChild(this.anchorElement)
  }

  load(delay = 0) {
    const epoch = ++this.loadEpoch
    const reveal = () => {
      if (this.loadEpoch !== epoch) return
      this.revealCall = null
      this.rootElement.classList.toggle('card-loading', false)
      this.anchorElement.href = this.descriptor.link
      this.anchorElement.title = this.descriptor.name
    }
    const schedule = () => {
      this.revealCall?.kill()
      this.revealCall =
        delay > 0 ? gsap.delayedCall(delay / 1000, reveal) : (reveal(), null)
    }
    const onReady = () => {
      if (this.loadEpoch !== epoch) return
      this.update()
      schedule()
    }
    const { imgElement } = this
    if (imgElement.src !== this.descriptor.thumb_src) {
      imgElement.src = this.descriptor.thumb_src
    }
    imgElement.decode().then(onReady, onReady)
  }

  appendTo(el, loadDelay = 0) {
    if (this.rootElement.parentElement !== el) {
      el.appendChild(this.rootElement)
      this.load(loadDelay)
    }
  }

  removeSelf() {
    if (!this.rootElement.parentElement) return
    this.loadEpoch++
    this.revealCall?.kill()
    this.revealCall = null
    this.rootElement.classList.toggle('card-loading', true)
    this.imgElement.removeAttribute('src')
    this.rootElement.remove()
  }

  update() {
    const { style } = this.rootElement
    if (this.width !== this._lastW) {
      style.width = `${this.width}px`
      this._lastW = this.width
    }
    if (this.height !== this._lastH) {
      style.height = `${this.height}px`
      this._lastH = this.height
    }
    style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`
  }
}

class Grid {
  constructor(DOMElement, JSONGallery) {
    this.descriptors = JSONGallery.images.sort(() => Math.random() - 0.5)
    this.DOMElement = DOMElement
    this.pairCache = {}
    this.cards = {}
    this.cardsPool = []
    this.state = { scale: MAX_SCALE, offsetX: 0, offsetY: 0 }
    this.viewPairs = 0
    this.viewWidth = 0
    this.viewHeight = 0
    this.firstLoad = true
    this.staggerMaxMs = 800
    this.zoomDuration = 0.4
    this.reduceMotion = false
    this.pinching = false
    this.lastPinchDist = 0
    this.draggable = null
    this.proxy = null
    this.lastDragX = 0
    this.lastDragY = 0
    this.zoomTween = null
    this.zoomAnchor = { scale: 1, offsetX: 0, offsetY: 0, cx: 0, cy: 0 }
    this.lastWheelTime = 0
    this.wheelGestureGap = 120
  }

  init() {
    this.proxy = document.createElement('div')
    this.proxy.style.cssText =
      'position:absolute;width:1px;height:1px;pointer-events:none;opacity:0;top:0;left:0'
    document.body.appendChild(this.proxy)

    window.addEventListener('resize', this.onResize.bind(this))
    requestAnimationFrame(() => this.onResize())

    const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotionPref = () => {
      this.reduceMotion = motionMQ.matches
      this.zoomDuration = this.reduceMotion ? 0 : 0.4
      this.staggerMaxMs = this.reduceMotion ? 0 : 800
      this.draggable?.kill()
      this.bindDrag()
    }
    applyMotionPref()
    motionMQ.addEventListener('change', applyMotionPref)

    this.bindZoom()

    setTimeout(() => {
      this.firstLoad = false
    }, this.staggerMaxMs + 400)
  }

  bindDrag() {
    const grid = this
    this.draggable = Draggable.create(this.proxy, {
      type: 'x,y',
      trigger: this.DOMElement,
      inertia: !this.reduceMotion,
      throwResistance: 3000,
      dragClickables: true,
      onPress() {
        grid.killZoomTween()
        grid.lastDragX = this.x
        grid.lastDragY = this.y
      },
      onDragStart() {
        grid.DOMElement.classList.add('dragging')
      },
      onDrag() {
        grid.applyDragDelta(this.x - grid.lastDragX, this.y - grid.lastDragY)
        grid.lastDragX = this.x
        grid.lastDragY = this.y
      },
      onThrowUpdate() {
        grid.applyDragDelta(this.x - grid.lastDragX, this.y - grid.lastDragY)
        grid.lastDragX = this.x
        grid.lastDragY = this.y
      },
      onRelease() {
        grid.DOMElement.classList.remove('dragging')
      }
    })[0]
  }

  applyDragDelta(dx, dy) {
    this.state.offsetX += dx
    this.state.offsetY += dy
    this.updateGrid()
  }

  killZoomTween() {
    this.zoomTween?.kill()
    this.zoomTween = null
  }

  bindZoom() {
    const el = this.DOMElement
    el.addEventListener('wheel', this.onWheel.bind(this), { passive: false })
    el.addEventListener('touchstart', this.onPinchStart.bind(this), {
      passive: false,
      capture: true
    })
    el.addEventListener('touchmove', this.onPinchMove.bind(this), {
      passive: false,
      capture: true
    })
    el.addEventListener('touchend', this.onPinchEnd.bind(this), false)
    el.addEventListener('touchcancel', this.onPinchEnd.bind(this), false)
  }

  onWheel(e) {
    e.preventDefault()
    const rect = this.DOMElement.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    if (e.ctrlKey || this.reduceMotion) {
      const factor = e.ctrlKey ? 0.01 : 0.0025
      const target = this.state.scale * Math.exp(-e.deltaY * factor)
      this.zoomImmediate(target, cx, cy)
    } else {
      const target = this.state.scale * Math.exp(-e.deltaY * 0.0025)
      this.zoomSmooth(target, cx, cy)
    }
  }

  onPinchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      this.pinching = true
      this.lastPinchDist = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      )
      this.draggable?.disable()
      this.killZoomTween()
    }
  }

  onPinchMove(e) {
    if (!this.pinching || e.touches.length < 2) return
    e.preventDefault()
    const t1 = e.touches[0]
    const t2 = e.touches[1]
    const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
    if (this.lastPinchDist <= 0) {
      this.lastPinchDist = dist
      return
    }
    const ratio = dist / this.lastPinchDist
    const rect = this.DOMElement.getBoundingClientRect()
    const cx = (t1.clientX + t2.clientX) / 2 - rect.left
    const cy = (t1.clientY + t2.clientY) / 2 - rect.top
    this.zoomImmediate(this.state.scale * ratio, cx, cy)
    this.lastPinchDist = dist
  }

  onPinchEnd(e) {
    if (e.touches.length < 2 && this.pinching) {
      this.pinching = false
      this.lastPinchDist = 0
      this.draggable?.enable()
    }
  }

  zoomImmediate(targetScale, cx, cy) {
    const next = clampScale(targetScale)
    if (next === this.state.scale) return
    const ratio = next / this.state.scale
    this.state.offsetX = cx + (this.state.offsetX - cx) * ratio
    this.state.offsetY = cy + (this.state.offsetY - cy) * ratio
    this.state.scale = next
    this.updateGrid()
  }

  zoomSmooth(targetScale, cx, cy) {
    const next = clampScale(targetScale)
    if (next === this.state.scale) return
    const now = performance.now()
    const newGesture = now - this.lastWheelTime > this.wheelGestureGap
    this.lastWheelTime = now
    if (newGesture) {
      this.zoomAnchor.scale = this.state.scale
      this.zoomAnchor.offsetX = this.state.offsetX
      this.zoomAnchor.offsetY = this.state.offsetY
      this.zoomAnchor.cx = cx
      this.zoomAnchor.cy = cy
    }
    const anchor = this.zoomAnchor
    this.zoomTween?.kill()
    this.zoomTween = gsap.to(this.state, {
      scale: next,
      duration: this.zoomDuration,
      ease: 'power2.out',
      onUpdate: () => {
        const ratio = this.state.scale / anchor.scale
        this.state.offsetX = anchor.cx + (anchor.offsetX - anchor.cx) * ratio
        this.state.offsetY = anchor.cy + (anchor.offsetY - anchor.cy) * ratio
        this.updateGrid()
      }
    })
  }

  staggerDelay(x, y) {
    if (!this.firstLoad || this.staggerMaxMs === 0) return 0
    const denom = this.viewWidth + this.viewHeight
    if (denom <= 0) return 0
    const norm = Math.max(0, Math.min(1, (x + y) / denom))
    return Math.round(norm * this.staggerMaxMs)
  }

  onResize() {
    this.viewHeight = this.DOMElement.offsetHeight
    this.viewWidth = this.DOMElement.offsetWidth
    this.updateGrid()
  }

  pickDescriptor(pair, i) {
    let h = ((pair * 73856093) ^ (i * 19349663)) >>> 0
    return this.descriptors[h % this.descriptors.length]
  }

  isWide(desc) {
    if (!desc.width || !desc.height) return false
    return desc.width / desc.height >= WIDE_RATIO
  }

  cardSize(desc) {
    if (!desc.width || !desc.height) {
      return { width: CARD_WIDTH, height: CARD_WIDTH, span: 1 }
    }
    if (this.isWide(desc)) {
      return {
        width: PAIR_WIDTH,
        height: Math.round(PAIR_WIDTH * (desc.height / desc.width)),
        span: 2
      }
    }
    return {
      width: CARD_WIDTH,
      height: Math.round(CARD_WIDTH * (desc.height / desc.width)),
      span: 1
    }
  }

  buildPairStripe(pair) {
    const items = []
    const MAX_FILL_TRIES = 16
    const MAX_PICK_TRIES = 32
    let yLeft = 0
    let yRight = 0
    let i = 0
    let lastLeft = null
    let lastRight = null

    const pickFresh = () => {
      let candidate = this.pickDescriptor(pair, i++)
      for (let k = 0; k < MAX_PICK_TRIES; k++) {
        if (candidate !== lastLeft && candidate !== lastRight) return candidate
        candidate = this.pickDescriptor(pair, i++)
      }
      return candidate
    }

    const place = (desc, wide) => {
      const size = this.cardSize(desc)
      if (wide) {
        const startY = Math.max(yLeft, yRight)
        items.push({
          desc,
          col: 0,
          y: startY,
          width: size.width,
          height: size.height
        })
        yLeft = startY + size.height
        yRight = startY + size.height
        lastLeft = desc
        lastRight = desc
        return
      }
      if (yLeft <= yRight) {
        items.push({
          desc,
          col: 0,
          y: yLeft,
          width: size.width,
          height: size.height
        })
        yLeft += size.height
        lastLeft = desc
      } else {
        items.push({
          desc,
          col: 1,
          y: yRight,
          width: size.width,
          height: size.height
        })
        yRight += size.height
        lastRight = desc
      }
    }

    const fillGap = () => {
      for (let k = 0; k < MAX_FILL_TRIES; k++) {
        if (yLeft === yRight) break
        const gap = Math.abs(yLeft - yRight)
        let chosen = null
        for (let t = 0; t < MAX_PICK_TRIES; t++) {
          const candidate = pickFresh()
          if (this.isWide(candidate)) continue
          if (this.cardSize(candidate).height <= gap) {
            chosen = candidate
            break
          }
        }
        if (!chosen) break
        place(chosen, false)
      }
    }

    while (Math.min(yLeft, yRight) < STRIPE_MIN_HEIGHT) {
      const desc = pickFresh()
      const wide = this.isWide(desc)
      if (wide) {
        fillGap()
        place(desc, true)
      } else {
        place(desc, wide)
      }
    }
    fillGap()
    return { items, total: Math.max(yLeft, yRight) }
  }

  getPairStripe(pair) {
    if (!this.pairCache[pair]) this.pairCache[pair] = this.buildPairStripe(pair)
    return this.pairCache[pair]
  }

  updateGrid() {
    const scale = this.state.scale
    const offsetX = this.state.offsetX
    const offsetY = this.state.offsetY
    this.viewPairs = Math.ceil(this.viewWidth / (PAIR_WIDTH * scale)) + 2

    const newCards = {}
    const sCardW = CARD_WIDTH * scale
    const sPairW = PAIR_WIDTH * scale
    const pairOffset = Math.floor(offsetX / sPairW)
    const xMod = offsetX - pairOffset * sPairW

    for (let p = -1; p <= this.viewPairs; p++) {
      const tPair = -pairOffset + p
      const xPos = p * sPairW + xMod - sPairW

      if (xPos + sPairW <= 0 || xPos >= this.viewWidth) continue

      const stripe = this.getPairStripe(tPair)
      const total = stripe.total * scale

      for (let i = 0; i < stripe.items.length; i++) {
        const item = stripe.items[i]
        const itemY = item.y * scale
        const itemH = item.height * scale
        const kMin = Math.floor((-itemH - itemY - offsetY) / total)
        const kMax = Math.ceil((this.viewHeight - itemY - offsetY) / total)
        for (let k = kMin; k <= kMax; k++) {
          const cy = itemY + offsetY + k * total
          if (cy + itemH <= 0 || cy >= this.viewHeight) continue

          const key = `${tPair}:${i}:${k}`
          const card =
            this.cards[key] || this.getCard(item.desc, item.width, item.height)
          delete this.cards[key]
          card.descriptor = item.desc
          card.width = item.width
          card.height = item.height
          card.scale = scale
          card.x = xPos + item.col * sCardW
          card.y = cy
          const delay = this.staggerDelay(card.x, card.y)
          card.appendTo(this.DOMElement, delay)
          card.update()
          newCards[key] = card
        }
      }
    }
    this.cleanupCards()
    this.cards = newCards
  }

  cleanupCards() {
    const keys = Object.keys(this.cards)
    for (let i = 0; i < keys.length; i++) {
      const card = this.cards[keys[i]]
      card.removeSelf()
      this.cardsPool.push(card)
    }
    this.cards = {}
  }

  getCard(descriptor, width, height) {
    if (this.cardsPool.length > 0) {
      const card = this.cardsPool.pop()
      card.descriptor = descriptor
      card.width = width
      card.height = height
      return card
    } else {
      return new Card(descriptor, width, height)
    }
  }
}

LoadJSON((gallery) => {
  let grid = new Grid(document.getElementById('illustrators'), gallery)
  grid.init()
})
