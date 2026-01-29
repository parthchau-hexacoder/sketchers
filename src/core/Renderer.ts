import * as THREE from 'three'

export class Renderer {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
    renderer = new THREE.WebGLRenderer;

    constructor(canvas: HTMLCanvasElement){
        this.scene.background = new THREE.Color('#ffffff');

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.position.z = 10;

        this.updateCamera(canvas)
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        window.addEventListener('resize', () => {
            this.updateCamera(canvas);
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        })

        this.animate();
    }

    private updateCamera(canvas: HTMLCanvasElement) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const viewSize = 20;

        this.camera.left   = -viewSize * aspect / 2;
        this.camera.right  =  viewSize * aspect / 2;
        this.camera.top    =  viewSize / 2;
        this.camera.bottom = -viewSize / 2;

        this.camera.updateProjectionMatrix();
    }


    add(obj:THREE.Object3D){
        this.scene.add(obj);
    }

    remove(obj:THREE.Object3D){
        this.scene.remove(obj);
    }

    animate = () =>{
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }
}