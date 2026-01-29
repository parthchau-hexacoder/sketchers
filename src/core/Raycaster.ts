import * as THREE from 'three'

export class Raycaster{
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();

    cast(
        event: MouseEvent,
        canvas: HTMLCanvasElement,
        camera: THREE.Camera,
        objects: THREE.Object3D[]
    ){
        const rect = canvas.getBoundingClientRect();

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, camera);
        return this.raycaster.intersectObjects(objects, true)
    }
}