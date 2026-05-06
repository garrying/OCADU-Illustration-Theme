import gsap from 'gsap'

const CARD_WIDTH = 300
const PAIR_WIDTH = CARD_WIDTH * 2
const STRIPE_MIN_HEIGHT = 8000
const WIDE_RATIO = 1.3

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
    if (this.dragging) {
      this.DOMElement.classList.add('dragging')

      e = e.type == 'touchmove' ? e.touches[0] : e
      let xDelta = e.clientX - this.lastX
      let yDelta = e.clientY - this.lastY
      let velocity = Math.abs(xDelta * yDelta)
      if (velocity > 50) {
        let v = { x: xDelta * 0.5, y: yDelta * 0.5 }
        if (this.tween) this.tween.kill()
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
  }

  createDOMElement() {
    this.rootElement = document.createElement('div')
    this.imgElement = document.createElement('img')
    this.rootElement.className = 'card'
    this.rootElement.appendChild(this.imgElement)
    this.anchorElement = document.createElement('a')
    this.anchorElement.className = 'w-full h-full block'
    this.rootElement.appendChild(this.anchorElement)
  }

  load() {
    let { imgElement } = this
    if (imgElement.src !== this.descriptor.thumb_src) {
      imgElement.src = this.descriptor.thumb_src
      imgElement.onload = () => {
        this.update()
        this.rootElement.classList.toggle('opacity-0', false)
        this.anchorElement.href = this.descriptor.link
        this.anchorElement.title = this.descriptor.name
      }
    }
  }

  appendTo(el) {
    if (this.rootElement.parentElement !== el) {
      el.appendChild(this.rootElement)
      this.load()
    }
  }

  removeSelf() {
    if (this.rootElement.parentElement) {
      this.rootElement.classList.toggle('opacity-0', true)
      this.imgElement.src = ''
      this.rootElement.parentElement.removeChild(this.rootElement)
    }
  }

  update() {
    this.rootElement.setAttribute(
      'style',
      `transform: translate3d(${this.x}px, ${this.y}px, 0); width: ${this.width}px; height: ${this.height}px;`
    )
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
  }

  init() {
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
    new SimpleDrag(this.DOMElement, this.onDrag.bind(this))
  }

  onDrag(deltaX, deltaY) {
    this.offsetX += deltaX
    this.offsetY += deltaY
    this.updateGrid()
  }

  onResize() {
    this.viewHeight = this.DOMElement.offsetHeight
    this.viewWidth = this.DOMElement.offsetWidth
    this.viewPairs = Math.ceil(this.viewWidth / PAIR_WIDTH) + 2
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
    const pairOffset = Math.floor(this.offsetX / PAIR_WIDTH)
    const xMod = this.offsetX - pairOffset * PAIR_WIDTH

    for (let p = -1; p <= this.viewPairs; p++) {
      const tPair = -pairOffset + p
      const xPos = p * PAIR_WIDTH + xMod - PAIR_WIDTH

      if (xPos + PAIR_WIDTH <= 0 || xPos >= this.viewWidth) continue

      const stripe = this.getPairStripe(tPair)
      const total = stripe.total
      const yMod = ((this.offsetY % total) + total) % total

      for (let i = 0; i < stripe.items.length; i++) {
        const item = stripe.items[i]
        let screenY = null
        for (let wrap = -1; wrap <= 1; wrap++) {
          const cy = item.y + yMod - total + wrap * total
          if (cy + item.height > 0 && cy < this.viewHeight) {
            screenY = cy
            break
          }
        }
        if (screenY === null) continue

        const key = `${tPair}:${i}`
        const card =
          this.cards[key] || this.getCard(item.desc, item.width, item.height)
        delete this.cards[key]
        card.descriptor = item.desc
        card.width = item.width
        card.height = item.height
        card.x = xPos + item.col * CARD_WIDTH
        card.y = screenY
        card.appendTo(this.DOMElement)
        card.update()
        newCards[key] = card
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
