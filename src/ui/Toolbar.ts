import type { ToolType } from "../types/ToolType";


export class Toolbar {
    constructor(container: HTMLElement, onSelect: (t: ToolType) => void) {
        (['select', 'line', 'circle', 'ellipse', 'polyline'] as ToolType[])
            .forEach(t => {
                const btn = document.createElement('button');
                btn.textContent = t;
                btn.onclick = () => onSelect(t);
                container.appendChild(btn);
            });      
    }

   
}