import * as THREE from 'three'
import type { Shape } from './Shape'

export class Circle implements Shape {
    readonly name = 'Circle';
    id = crypto.randomUUID();
    visible = true;
    mesh: THREE.Mesh;

    center: THREE.Vector2;
    radius: number;
    color: string;

    constructor(
        center: THREE.Vector2,
        radius: number,
        color = '#ff5555'
    ) {
        this.center = center;
        this.radius = radius;
        this.color = color;

        const cricleGeometry = new THREE.CircleGeometry(radius, 64);
        const circleMaterial = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(cricleGeometry, circleMaterial);
        this.mesh.position.set(center.x, center.y, 0);
    }

    update({ center, radius }: any): void {
        if (center) {
            this.center = center;
            this.mesh.position.set(center.x, center.y, 0);
        }

        if (radius) {
            this.radius = radius;
            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.CircleGeometry(radius, 64);
        }
    }

    setColor(color: string): void {
        (this.mesh.material as THREE.MeshBasicMaterial).color.set(color);
        this.color = color;
    }

    toJSON() {
        return {
            id: this.id,
            type: 'circle',
            data: {
                center: this.center,
                radius: this.radius
            },
            color: '#ff5555',
            visible: this.visible
        }
    }
}