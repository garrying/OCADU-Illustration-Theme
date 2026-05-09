import gsap from 'gsap'

const CARD_WIDTH = 300
const PAIR_WIDTH = CARD_WIDTH * 2
const STRIPE_MIN_HEIGHT = 8000
const WIDE_RATIO = 1.3
const MIN_SCALE = 0.15
const MAX_SCALE = 1.0

function LoadJSON(callback) {
  const jsonData = JSON.parse(document.getElementById('image-data').textContent)
  callback(jsonData)
}

class SimpleDrag {
  constructor(DOMElement, onDrag) {
    this.useTouch = this.isTouch()
    this.dragging = false
    this.lastX = 0
    this.lastY = 0
    this.tween = undefined
    this.prevVelocity = 0
    this.DOMElement = DOMElement
    this.onDragCallback = onDrag
    this.bind()
  }

  onMove(e) {
    if (e.type == 'touchmove' && e.touches.length > 1) {
      this.dragging = false
      return
    }
    if (this.dragging) {
      this.DOMElement.classList.add('dragging')

      e = e.type == 'touchmove' ? e.touches[0] : e
      let xDelta = e.clientX - this.lastX
      let yDelta = e.clientY - this.lastY
      let velocity = Math.abs(xDelta * yDelta)
      if (velocity > 50) {
        let v = { x: xDelta * 0.5, y: yDelta * 0.5 }
        this.tween?.kill()
        this.tween = gsap.to(v, {
          duration: 0.5,
          x: 0,
          y: 0,
          onUpdate: () => {
            this.onDragCallback(v.x, v.y)
          }
        })
      }

      this.onDragCallback(xDelta, yDelta)
      this.lastX = e.clientX
      this.lastY = e.clientY
    }
  }

  onStart(e) {
    if (e.type == 'touchstart' && e.touches.length > 1) {
      this.dragging = false
      return
    }
    e = e.type == 'touchstart' ? e.touches[0] : e
    this.lastX = e.clientX
    this.lastY = e.clientY
    this.dragging = true
  }

  onEnd() {
    this.dragging = false
    this.DOMElement.classList.remove('dragging')
  }

  isTouch() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  }

  bind() {
    let el = this.DOMElement
    if (this.useTouch) {
      el.addEventListener('touchstart', this.onStart.bind(this), false)
      el.addEventListener('touchmove', this.onMove.bind(this), false)
      el.addEventListener('touchend', this.onEnd.bind(this), false)
    } else {
      el.addEventListener('mousedown', this.onStart.bind(this), false)
      el.addEventListener('mousemove', this.onMove.bind(this), false)
      el.addEventListener('mouseup', this.onEnd.bind(this), false)
    }
  }
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
    let { imgElement } = this
    if (imgElement.src !== this.descriptor.thumb_src) {
      imgElement.src = this.descriptor.thumb_src
      imgElement.onload = () => {
        this.update()
        const reveal = () => {
          this.rootElement.classList.toggle('card-loading', false)
          this.anchorElement.href = this.descriptor.link
          this.anchorElement.title = this.descriptor.name
        }
        if (delay > 0) setTimeout(reveal, delay)
        else reveal()
      }
    }
  }

  appendTo(el, loadDelay = 0) {
    if (this.rootElement.parentElement !== el) {
      el.appendChild(this.rootElement)
      this.load(loadDelay)
    }
  }

  removeSelf() {
    if (!this.rootElement.parentElement) return
    this.rootElement.classList.toggle('card-loading', true)
    this.imgElement.src = ''
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
    this.offsetX = 0
    this.offsetY = 0
    this.viewPairs = 0
    this.viewWidth = 0
    this.viewHeight = 0
    this.firstLoad = true
    this.staggerMaxMs = 800
    this.scale = MAX_SCALE
    this.pinching = false
    this.lastPinchDist = 0
    this.zoomTween = null
  }

  init() {
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
    new SimpleDrag(this.DOMElement, this.onDrag.bind(this))
    this.bindZoom()
    setTimeout(() => {
      this.firstLoad = false
    }, this.staggerMaxMs + 400)
  }

  bindZoom() {
    const el = this.DOMElement
    el.addEventListener('wheel', this.onWheel.bind(this), { passive: false })
    el.addEventListener('touchstart', this.onPinchStart.bind(this), { passive: false })
    el.addEventListener('touchmove', this.onPinchMove.bind(this), { passive: false })
    el.addEventListener('touchend', this.onPinchEnd.bind(this), false)
    el.addEventListener('touchcancel', this.onPinchEnd.bind(this), false)
  }

  onWheel(e) {
    e.preventDefault()
    const factor = e.ctrlKey ? 0.02 : 0.005
    const target = this.scale * Math.exp(-e.deltaY * factor)
    const rect = this.DOMElement.getBoundingClientRect()
    const duration = e.ctrlKey ? 0.08 : 0.28
    this.zoomAt(target, e.clientX - rect.left, e.clientY - rect.top, duration)
  }

  onPinchStart(e) {
    if (e.touches.length === 2) {
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      this.pinching = true
      this.lastPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
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
    this.zoomAt(this.scale * ratio, cx, cy, 0.08)
    this.lastPinchDist = dist
  }

  onPinchEnd(e) {
    if (e.touches.length < 2) {
      this.pinching = false
      this.lastPinchDist = 0
    }
  }

  zoomAt(targetScale, cx, cy, duration = 0.28) {
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, targetScale))
    if (next === this.scale) return
    const ratio = next / this.scale
    const targetOffsetX = cx + (this.offsetX - cx) * ratio
    const targetOffsetY = cy + (this.offsetY - cy) * ratio

    this.zoomTween?.kill()
    const state = {
      scale: this.scale,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    }
    this.zoomTween = gsap.to(state, {
      duration,
      ease: 'power3.out',
      scale: next,
      offsetX: targetOffsetX,
      offsetY: targetOffsetY,
      onUpdate: () => {
        this.scale = state.scale
        this.offsetX = state.offsetX
        this.offsetY = state.offsetY
        this.viewPairs = Math.ceil(this.viewWidth / (PAIR_WIDTH * this.scale)) + 2
        this.updateGrid()
      }
    })
  }

  staggerDelay(x, y) {
    if (!this.firstLoad) return 0
    const denom = this.viewWidth + this.viewHeight
    if (denom <= 0) return 0
    const norm = Math.max(0, Math.min(1, (x + y) / denom))
    return Math.round(norm * this.staggerMaxMs)
  }

  onDrag(deltaX, deltaY) {
    this.zoomTween?.kill()
    this.zoomTween = null
    this.offsetX += deltaX
    this.offsetY += deltaY
    this.updateGrid()
  }

  onResize() {
    this.viewHeight = this.DOMElement.offsetHeight
    this.viewWidth = this.DOMElement.offsetWidth
    this.viewPairs = Math.ceil(this.viewWidth / (PAIR_WIDTH * this.scale)) + 2
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
        items.push({ desc, col: 0, y: startY, width: size.width, height: size.height })
        yLeft = startY + size.height
        yRight = startY + size.height
        lastLeft = desc
        lastRight = desc
        return
      }
      if (yLeft <= yRight) {
        items.push({ desc, col: 0, y: yLeft, width: size.width, height: size.height })
        yLeft += size.height
        lastLeft = desc
      } else {
        items.push({ desc, col: 1, y: yRight, width: size.width, height: size.height })
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
    const newCards = {}
    const sCardW = CARD_WIDTH * this.scale
    const sPairW = PAIR_WIDTH * this.scale
    const pairOffset = Math.floor(this.offsetX / sPairW)
    const xMod = this.offsetX - pairOffset * sPairW

    for (let p = -1; p <= this.viewPairs; p++) {
      const tPair = -pairOffset + p
      const xPos = p * sPairW + xMod - sPairW

      if (xPos + sPairW <= 0 || xPos >= this.viewWidth) continue

      const stripe = this.getPairStripe(tPair)
      const total = stripe.total * this.scale
      const yMod = ((this.offsetY % total) + total) % total
      const wrapMax = Math.ceil(this.viewHeight / total) + 1

      for (let i = 0; i < stripe.items.length; i++) {
        const item = stripe.items[i]
        const itemY = item.y * this.scale
        const itemH = item.height * this.scale
        for (let wrap = -1; wrap <= wrapMax; wrap++) {
          const cy = itemY + yMod - total + wrap * total
          if (cy + itemH <= 0 || cy >= this.viewHeight) continue

          const key = `${tPair}:${i}:${wrap}`
          const card =
            this.cards[key] || this.getCard(item.desc, item.width, item.height)
          delete this.cards[key]
          card.descriptor = item.desc
          card.width = item.width
          card.height = item.height
          card.scale = this.scale
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
    this.cards = null
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
