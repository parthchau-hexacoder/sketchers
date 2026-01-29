import * as THREE from 'three'
import type { Shape } from './Shape'

export class Line implements Shape {
    readonly name = 'Line';
    id = crypto.randomUUID();
    visible = true;
    mesh: THREE.Line;
    start: THREE.Vector2;
    end: THREE.Vector2;
    color: string;

    constructor(start: THREE.Vector2, end: THREE.Vector2, color = "#ff0000") {
        this.start = start;
        this.end = end;
        this.color = color;


        const lineGeometry = this.createGeometry(start, end);

        this.mesh = new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({ color })
        )
    }

    private createGeometry(start: THREE.Vector2, end: THREE.Vector2) {
        return new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(start.x, start.y, 0),
            new THREE.Vector3(end.x, end.y, 0)
        ])
    }

    update({ start, end }: any) {
        if (start) this.start = start;
        if (end) this.end = end;

        this.mesh.geometry.dispose();
        this.mesh.geometry = this.createGeometry(start, end);
    }

    setColor(color: string) {
        (this.mesh.material as THREE.LineBasicMaterial).color.set(color);
        this.color = color;
    }

    toJSON() {
        return {
            id: this.id,
            type: 'line',
            data: { start: this.start, end: this.end },
            color: '#ff0000',
            visible: this.visible
        }
    }

}