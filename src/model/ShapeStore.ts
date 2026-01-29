import type { Shape } from "./shapes/Shape";
import * as THREE from 'three'

type Listener = () => void

export class ShapeStore{
    shapes = new Map<string, Shape>();
    private selectedId: string | null = null;
    private listners: Listener[] = [];
    
    subscribe(fn: Listener){
        this.listners.push(fn);
    }
    
    private notify(){
        this.listners.forEach(fn => fn());
    }

    add(shape: Shape){
        this.shapes.set(shape.id, shape);
        this.notify();
    }


    remove(id: string){
        const shape = this.shapes.get(id);
        if (!shape) return;

        this.shapes.delete(id);
        shape.mesh.removeFromParent();

        if (this.selectedId === id) this.selectedId = null;
        this.notify();
    }

    select(id: string){
        this.selectedId = id;
        this.notify();
    }

    toggleVisibility(id: string){
        const shape = this.shapes.get(id);
        if(!shape) return;

        shape.visible = !shape.visible;
        shape.mesh.visible = shape.visible;
        this.notify();
    }

    refresh() {
        this.notify()
    }

    getSelected(){
        return this.selectedId ? this.shapes.get(this.selectedId) : null;
    }

    getAll(){
        return [...this.shapes.values()]
    }

    findByMesh(mesh: THREE.Object3D){
        for(const shape of this.shapes.values()){
            if(shape.mesh === mesh) return shape;
        }
        return null;
    }
}