import Two from 'two.js'
import Matter from 'matter-js'
import MatterAttractors from 'matter-attractors'

const entities = []
const TitleElement = document.getElementById('title')

const two = new Two({
  type: Two.Types.canvas,
  fitted: true,
  autostart: true
}).appendTo(TitleElement)

const solver = Matter.Engine.create()
solver.gravity.y = 0

const bounds = {
  length: 0,
  thickness: 0,
  properties: {
    isStatic: true
  }
}

bounds.top = createBoundary(bounds.length, bounds.thickness)
bounds.left = createBoundary(bounds.thickness, bounds.length)
bounds.right = createBoundary(bounds.thickness, bounds.length)
bounds.bottom = createBoundary(bounds.length, bounds.thickness)

Matter.World.add(solver.world, [
  bounds.top.entity,
  bounds.left.entity,
  bounds.right.entity,
  bounds.bottom.entity
])

Matter.use(MatterAttractors)

const attractiveBody = Matter.Bodies.circle(
  TitleElement.clientWidth / 2,
  TitleElement.clientHeight / 2,
  100,
  {
    isStatic: true,

    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6
          }
        }
      ]
    }
  }
)

Matter.World.add(solver.world, attractiveBody)

const defaultStyles = {
  margin: {
    top: 100,
    left: 0,
    right: 0,
    bottom: 0
  }
}

addShapes()
resize()

const mouse = addMouseInteraction()
two.bind('update', update)

function addMouseInteraction() {
  const mouse = Matter.Mouse.create(TitleElement)
  const mouseConstraint = Matter.MouseConstraint.create(solver, {
    mouse,
    constraint: {
      stiffness: 0.2
    }
  })

  Matter.World.add(solver.world, mouseConstraint)

  Matter.Events.on(solver, 'afterUpdate', function () {
    if (!mouse.position.x) {
      return
    }

    Matter.Body.translate(attractiveBody, {
      x: mouse.position.x - attractiveBody.position.x,
      y: mouse.position.y - attractiveBody.position.y
    })
  })

  return mouseConstraint
}

mouse.mouse.element.removeEventListener('mousewheel', mouse.mouse.mousewheel)
mouse.mouse.element.removeEventListener(
  'DOMMouseScroll',
  mouse.mouse.mousewheel
)
mouse.mouse.element.removeEventListener('touchmove', mouse.mouse.mousemove)
mouse.mouse.element.removeEventListener('touchstart', mouse.mouse.mousedown)
mouse.mouse.element.removeEventListener('touchend', mouse.mouse.mouseup)

function resize() {
  window.addEventListener('resize', () => {
    two.width = TitleElement.clientWidth
    two.height = TitleElement.clientHeight
  })
}

function addShapes() {
  let x = 0
  let y = 0

  for (let i = 0; i < 60; i++) {
    const group = new Two.Group()

    const rect = {
      width: 0,
      height: 0
    }
    let ox = x + rect.width
    let oy = y + rect.height

    const ca = x + rect.width
    const cb = two.width

    if (ca >= cb) {
      x = defaultStyles.margin.left
      y += defaultStyles.margin.top + defaultStyles.margin.bottom

      ox = x + rect.width / 2
      oy = y + rect.height / 2
    }

    const rectangle = new Two.RoundedRectangle(0, 0, 100, 100, 8)
    rectangle.fill = 'rgb(251,249,244)'
    rectangle.noStroke()

    const entity = Matter.Bodies.rectangle(ox, oy, 1, 1)
    Matter.Body.scale(entity, 100, 100)

    entity.scale = new Two.Vector(100, 100)
    entity.object = group
    entities.push(entity)

    x += 100 + defaultStyles.margin.left + defaultStyles.margin.right

    group.rectangle = rectangle
    group.entity = entity

    group.add(rectangle)
    two.add(group)
  }

  Matter.World.add(solver.world, entities)
}

function update() {
  const allBodies = Matter.Composite.allBodies(solver.world)
  Matter.MouseConstraint.update(mouse, allBodies)
  Matter.MouseConstraint._triggerEvents(mouse)

  Matter.Engine.update(solver)

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]
    entity.object.position.copy(entity.position)
    entity.object.rotation = entity.angle
  }
}

function createBoundary(width, height) {
  const rectangle = two.makeRectangle(0, 0, width, height)
  rectangle.visible = false

  rectangle.entity = Matter.Bodies.rectangle(
    0,
    0,
    width,
    height,
    bounds.properties
  )
  rectangle.entity.position = rectangle.position

  return rectangle
}
