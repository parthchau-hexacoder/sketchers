import * as THREE from 'three'
import type { ShapeDTO } from '../../types/ShapeDTO'

export interface Shape {
  id: string
  mesh: THREE.Object3D
  visible: boolean
  color: string
  readonly name: string

  update(data: any): void
  setColor(color: string): void
  toJSON(): ShapeDTO
}
