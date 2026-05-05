import gsap from 'gsap'

const CARD_WIDTH = 300
const MIN_CARD_HEIGHT = 200
const MAX_CARD_HEIGHT = 600
const STRIPE_MIN_HEIGHT = 8000

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
  constructor(descriptor, height) {
    this.descriptor = descriptor
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
      `transform: translate3d(${this.x}px, ${this.y}px, 0); height: ${this.height}px;`
    )
  }
}

class Grid {
  constructor(DOMElement, JSONGallery) {
    this.descriptors = JSONGallery.images.sort(() => Math.random() - 0.5)
    this.DOMElement = DOMElement
    this.colCache = {}
    this.cards = {}
    this.cardsPool = []
    this.offsetX = 0
    this.offsetY = 0
    this.viewCols = 0
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
    this.viewCols = Math.ceil(this.viewWidth / CARD_WIDTH) + 2
    this.updateGrid()
  }

  pickDescriptor(col, row) {
    let h = ((col * 73856093) ^ (row * 19349663)) >>> 0
    return this.descriptors[h % this.descriptors.length]
  }

  cardHeight(desc) {
    if (!desc.width || !desc.height) return 400
    let h = CARD_WIDTH * (desc.height / desc.width)
    return Math.round(Math.max(MIN_CARD_HEIGHT, Math.min(MAX_CARD_HEIGHT, h)))
  }

  buildColStripe(col) {
    const items = []
    let y = 0
    let i = 0
    while (y < STRIPE_MIN_HEIGHT) {
      const desc = this.pickDescriptor(col, i)
      const height = this.cardHeight(desc)
      items.push({ desc, y, height })
      y += height
      i++
    }
    return { items, total: y }
  }

  getColStripe(col) {
    if (!this.colCache[col]) this.colCache[col] = this.buildColStripe(col)
    return this.colCache[col]
  }

  updateGrid() {
    const newCards = {}
    const colOffset = Math.floor(this.offsetX / CARD_WIDTH)
    const xMod = this.offsetX - colOffset * CARD_WIDTH

    for (let col = -1; col <= this.viewCols; col++) {
      const tCol = -colOffset + col
      const xPos = col * CARD_WIDTH + xMod - CARD_WIDTH

      if (xPos + CARD_WIDTH <= 0 || xPos >= this.viewWidth) continue

      const stripe = this.getColStripe(tCol)
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

        const key = `${tCol}:${i}`
        const card =
          this.cards[key] || this.getCard(item.desc, item.height)
        delete this.cards[key]
        card.descriptor = item.desc
        card.height = item.height
        card.x = xPos
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

  getCard(descriptor, height) {
    if (this.cardsPool.length > 0) {
      const card = this.cardsPool.pop()
      card.descriptor = descriptor
      card.height = height
      return card
    } else {
      return new Card(descriptor, height)
    }
  }
}

LoadJSON((gallery) => {
  let grid = new Grid(document.getElementById('illustrators'), gallery)
  grid.init()
})
