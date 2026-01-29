import type { ToolType } from "../types/ToolType";


export class Toolbar {
    constructor(container: HTMLElement, onSelect: (t: ToolType) => void) {
        //@ts-ignore
        const icons: Record<ToolType, string> = {
            select: 'ri-cursor-line',
            line: 'ri-subtract-line',
            circle: 'ri-checkbox-blank-circle-line',
            ellipse: 'ri-disc-line',
            polyline: 'ri-share-line'
        };

        (Object.keys(icons) as ToolType[]).forEach(t => {
            const btn = document.createElement('button');
            btn.innerHTML = `<i class="${icons[t]}"></i> <span>${t}</span>`;

            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.gap = '8px';

            btn.onclick = () => {
                Array.from(container.children).forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                onSelect(t);
            };
            container.appendChild(btn);
        });

        if (container.firstElementChild) container.firstElementChild.classList.add('active');
    }


}