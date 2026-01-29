import * as THREE from 'three'
import type { Shape } from './Shape'

export class Ellipse implements Shape {
    readonly name = 'Ellipse';
    id = crypto.randomUUID();
    visible = true;
    mesh: THREE.LineLoop;

    center: THREE.Vector2;
    radiusX: number;
    radiusY: number;
    color: string;


    constructor(
        center: THREE.Vector2,
        radiusX: number,
        radiusY: number,
        color: string = '#00aa88'
    ) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.color = color;

        const geometry = this.createGeometry(radiusX, radiusY);
        const material = new THREE.LineBasicMaterial({ color });

        this.mesh = new THREE.LineLoop(geometry, material);
        this.mesh.position.set(center.x, center.y, 0);
    }

    private createGeometry(rx: number, ry: number) {
        const curve = new THREE.EllipseCurve(
            0, 0,
            rx, ry,
            0, Math.PI * 2,
            false,
            0
        )

        const points = curve.getPoints(64);
        return new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, 0))
        )
    }

    update({
        center,
        radiusX,
        radiusY
    }: {
        center?: THREE.Vector2,
        radiusX?: number,
        radiusY?: number,

    }): void {
        if (center) {
            this.center = center;
            this.mesh.position.set(center.x, center.y, 0);
        }

        if (radiusX !== undefined && radiusY !== undefined) {
            this.radiusX = radiusX;
            this.radiusY = radiusY;

            this.mesh.geometry.dispose();
            this.mesh.geometry = this.createGeometry(radiusX, radiusY);
        }
    }

    setColor(color: string) {
        (this.mesh.material as THREE.LineBasicMaterial).color.set(color);
        this.color = color;
    }

    toJSON() {
        return {
            id: this.id,
            type: 'ellipse',
            data: {
                center: this.center,
                radiusX: this.radiusX,
                radiusY: this.radiusY
            },
            color: '#00aa88',
            visible: this.visible
        }
    }
}