import * as THREE from 'three';
import type { Shape } from './Shape';

export class Polyline implements Shape{
    id = crypto.randomUUID();
    visible =  true;
    color: string;
    mesh: THREE.Line;

    points: THREE.Vector2[];

    constructor(points:THREE.Vector2[], color = '#ff8800'){
        this.points = points;
        this.color = color;

        const geometry = this.createGeometry(points);
        const material = new THREE.LineBasicMaterial({color});

        this.mesh = new THREE.Line(geometry, material)
    }

    private createGeometry(points: THREE.Vector2[]) {
        return new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, 0))
        )
    }

    update({ points }: { points?: THREE.Vector2[] }): void {
        if(!points) return;

        this.points = points;
        this.mesh.geometry.dispose();
        this.mesh.geometry = this.createGeometry(points);
    }

    setColor(color: string) {
        this.color = color
        ;(this.mesh.material as THREE.LineBasicMaterial).color.set(color)
    }

    rebuild() {
        this.mesh.geometry.dispose()
        this.mesh.geometry = new THREE.BufferGeometry().setFromPoints(
            this.points.map(p => new THREE.Vector3(p.x, p.y, 0))
        )
    }


    toJSON() {
        return {
            id: this.id,
            type: 'polyline',
            data: { points: this.points },
            color: this.color,
            visible: this.visible
        }
    }
}