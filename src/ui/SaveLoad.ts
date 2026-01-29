import type { ShapeStore } from "../model/ShapeStore";
import { FileService } from "../services/FileService";
import type { Renderer } from '../core/Renderer';

export class SaveLoad{
    constructor(container: HTMLElement, store: ShapeStore, renderer: Renderer){
        this.renderSave(container, store);
        this.renderLoad(container, store, renderer);
    }

    private renderSave(container: HTMLElement, store: ShapeStore){
        const save = document.createElement('button');
        save.innerText = 'Save'
        save.addEventListener('click', () => {
            FileService.save(store.getAll())
        })
        container.appendChild(save)
    }
    
    private renderLoad(container: HTMLElement, store: ShapeStore, renderer: Renderer){
        const load = document.createElement('button');
        load.innerText ='Load';

        const input = document.createElement('input');
        input.type ='file';
        input.accept = '.json';
        input.style.display = 'none'

        load.addEventListener('click', () => {
            input.click();
        });

        input.onchange = async () =>{
            if (!input.files || input.files.length === 0) return;

            const file = input.files?.[0];
            const text = await file?.text();
            let json: any = null;
            if(text) json = JSON.parse(text);

            store.getAll().forEach( s => store.remove(s.id));

            FileService.load(json, shape => {
                store.add(shape);
                renderer.add(shape.mesh);
            })

        }

        container.appendChild(load);
        container.appendChild(input);
    }
}