import gsap from 'gsap'

const CARD_WIDTH = 300
const CARD_HEIGHT = 400
const FIXED_ROWS = 5
const FIXED_COLS = 5

const NEIGHBOURS = [
  [0, -1], // up
  [0, 1], // down
  [1, 0], // right
  [-1, 0], // left
  [1, 1], // bottom right
  [-1, 1], // bottom left
  [-1, -1], // upper left
  [1, -1] // upper right
]

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
      e = e.type == 'touchmove' ? e.touches[0] : e
      let xDelta = e.clientX - this.lastX
      let yDelta = e.clientY - this.lastY
      let velocity = Math.abs(xDelta * yDelta)
      if (velocity > 50) {
        //this.dragging = false;
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
  constructor(descriptor) {
    this.descriptor = descriptor
    this.createDOMElement()
    this.x = 0
    this.y = 0
  }

  createDOMElement() {
    this.rootElement = document.createElement('div')
    this.imgElement = document.createElement('img')
    this.rootElement.className = 'card'
    this.rootElement.appendChild(this.imgElement)
  }

  load() {
    let { imgElement } = this
    if (imgElement.src !== this.descriptor.thumb_src) {
      imgElement.src = this.descriptor.thumb_src
      imgElement.onload = () => {
        this.update()
        this.rootElement.classList.toggle('opacity-0', false)
      }
    }
  }

  appendTo(el) {
    if (this.rootElement.parentElement !== el) {
      //console.log('append');
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
    let cssBatch = ''
    cssBatch += `transform: translate3d(${this.x}px, ${this.y}px, 0);`
    //cssBatch += 'display:' + ( this._visible ? 'block;' : 'none;' );

    this.rootElement.setAttribute('style', cssBatch)
  }
}

class Grid {
  constructor(DOMElement, JSONGallery) {
    this.descriptors = JSONGallery.images.sort(() => Math.random() - 0.5)
    this.DOMElement = DOMElement
    // dict to save previous assignations by col and row
    this.picks = {}
    // current visible cards
    this.cards = {}
    // all elements are cached and reused
    this.cardsPool = []
    this.offsetX = 0
    this.offsetY = 0
    this.viewCols = 0
    this.viewRows = 0
    this.viewWidth = 0
    this.viewHeight = 0
  }

  init() {
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
    new SimpleDrag(this.DOMElement, this.onDrag.bind(this))
  }

  getGalleryDescriptor(index) {
    return this.descriptors[index % this.descriptors.length]
  }

  onDragEnd() {
    //this.DOMElement.classList.remove( "hover-enabled" );
    //this.DOMElement.classList.add( "hover-enabled" );
  }

  onDrag(deltaX, deltaY) {
    //this.DOMElement.classList.remove( "hover-enabled" );
    //console.log( e );
    this.offsetX += deltaX
    this.offsetY += deltaY
    this.updateGrid()
  }

  onResize() {
    this.viewHeight = this.DOMElement.offsetHeight
    this.viewWidth = this.DOMElement.offsetWidth
    this.updateViewColRows()
    this.updateGrid()
  }

  updateViewColRows() {
    this.viewCols = Math.ceil(this.viewWidth / CARD_WIDTH) + 2
    this.viewRows = Math.ceil(this.viewHeight / CARD_HEIGHT) + 2
  }

  isVisible(x, y) {
    return (
      x + CARD_WIDTH > 0 &&
      y + CARD_HEIGHT > 0 &&
      x < this.viewWidth &&
      y < this.viewHeight
    )
  }

  getRandomSafe(col, row) {
    let pick
    let tries = 0
    let i = 0

    while (pick === undefined) {
      let rnd = ~~(Math.random() * 10000)
      let item = this.getGalleryDescriptor(rnd)
      for (i = 0; i < NEIGHBOURS.length; i++) {
        let offsets = NEIGHBOURS[i]
        let key = `${col + offsets[0]}:${row + offsets[1]}`
        if (this.picks[key] === item) {
          break
        }
      }

      if (tries++ > 20 || i === NEIGHBOURS.length) {
        pick = item
      }
    }

    return pick
  }

  getRandomDescriptor(col, row) {
    let key = `${col}:${row}`
    if (!this.picks[key]) {
      let item = this.getRandomSafe(col, row)
      this.picks[key] = item
    }
    return this.picks[key]
  }

  getCardPos(col, row) {
    let offsetX = this.offsetX % CARD_WIDTH
    let offsetY = this.offsetY % CARD_HEIGHT
    let x = col * CARD_WIDTH + offsetX - CARD_WIDTH
    let y = row * CARD_HEIGHT + offsetY - CARD_HEIGHT
    return [Math.round(x), Math.round(y)]
  }

  updateGrid() {
    let newCards = {}
    let colOffset = ~~(this.offsetX / CARD_WIDTH) * -1
    let rowOffset = ~~(this.offsetY / CARD_HEIGHT) * -1
    for (let row = -1; row < this.viewRows; row++) {
      for (let col = -1; col < this.viewCols; col++) {
        let desc = undefined
        let tCol = colOffset + col
        let tRow = rowOffset + row
        if (tCol > 0 && tRow > 0 && tCol < FIXED_COLS && tRow < FIXED_ROWS) {
          let index = tRow * FIXED_COLS + tCol
          desc = this.getGalleryDescriptor(index)
        } else {
          desc = this.getRandomDescriptor(tCol, tRow)
        }

        let [x, y] = this.getCardPos(col, row)

        if (this.isVisible(x, y)) {
          let index = tCol + '' + tRow
          let card = this.cards[index] || this.getCard(desc)
          delete this.cards[index]
          card.x = x
          card.y = y
          card.appendTo(this.DOMElement)
          card.update()
          newCards[index] = card
        }
      }
    }
    this.cleanupCards()
    this.cards = newCards
  }

  cleanupCards() {
    let keys = Object.keys(this.cards)
    for (let i = 0; i < keys.length; i++) {
      let card = this.cards[keys[i]]
      card.removeSelf()
      this.cardsPool.push(card)
    }
    this.cards = null
  }

  getCard(descriptor) {
    if (this.cardsPool.length > 0) {
      let card = this.cardsPool.pop()
      card.descriptor = descriptor
      return card
    } else {
      return new Card(descriptor)
    }
  }
}

LoadJSON((gallery) => {
  let grid = new Grid(document.getElementById('illustrators'), gallery)
  grid.init()
})
