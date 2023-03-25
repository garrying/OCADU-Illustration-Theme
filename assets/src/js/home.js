import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import { LayerMaterial, Depth } from 'lamina'

extend({ MeshLineGeometry, MeshLineMaterial })

function Fatline ({ curve, width, color, speed }) {
  const material = useRef()
  useFrame(() => (material.current.uniforms.dashOffset.value -= speed))
  return (
    <mesh>
      <meshLineGeometry points={curve} />
      <meshLineMaterial ref={material} transparent toneMapped={false} depthTest={false} lineWidth={width} color={color} dashArray={0.1} dashRatio={0.8} />
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
      <Bg />
      <Lines count={20} colors={['#ffffff', '#22fff8', '#fa8072']} />
      <Rig />
    </Canvas>
  )
}

function Bg () {
  return (
    <mesh scale={100}>
      <boxGeometry args={[1, 1, 1]} />
      <LayerMaterial toneMapped={false} side={THREE.BackSide}>
        <Depth colorB='#ffebe5' colorA='#ffffff' near={130} far={200} origin={[100, 100, -100]} />
      </LayerMaterial>
    </mesh>
  )
}

const root = createRoot(document.querySelector('#root'))
root.render(<App />)
