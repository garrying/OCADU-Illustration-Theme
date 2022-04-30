import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as meshline from 'meshline'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'

extend(meshline)

function Fatline ({ curve, width, color, speed }) {
  const material = useRef()
  useFrame(() => (material.current.uniforms.dashOffset.value -= speed))
  return (
    <mesh>
      <meshLine attach='geometry' points={curve} />
      <meshLineMaterial attach='material' ref={material} transparent depthTest={false} lineWidth={width} color={color} dashArray={0.1} dashRatio={0.8} />
    </mesh>
  )
}

function Lines ({ count, colors }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        const pos = new THREE.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, 10 - Math.random() * 20)
        const points = new Array(50).fill().map(() => pos.add(new THREE.Vector3(4 - Math.random() * 8, 4 - Math.random() * 8, 2 - Math.random() * 4)).clone())
        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, 0.5 * Math.random()),
          speed: Math.max(0.00001, 0.00005 * Math.random()),
          curve
        }
      }),
    [colors, count]
  )
  return lines.map((props, index) => <Fatline key={index} {...props} />)
}

function Rig ({ mouse }) {
  const { camera, viewport } = useThree()
  useFrame((state) => {
    camera.position.x += (state.mouse.x * viewport.width - camera.position.x) * 0.05
    camera.position.y += (-state.mouse.y * viewport.height - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

function App () {
  return (
    <Canvas linear legacy camera={{ position: [0, 0, 10], fov: 20 }}>
      <Lines count={25} colors={['#ff5722', '#ffffff', '#22fff8']} />
      <Rig />
    </Canvas>
  )
}

const root = createRoot(document.querySelector('#root'))
root.render(<App />)
