import type { ShapeStore } from '../model/ShapeStore'


export class ObjectList {
    private container: HTMLElement;
    private store: ShapeStore;

    constructor(container: HTMLElement, store: ShapeStore) {
        this.container = container;
        this.store = store;

        this.store.subscribe(() => this.render())
    }

    private render() {

        this.container.innerHTML = '<h3>Objects</h3>'
        this.store.getAll().forEach(shape => {
            const row = document.createElement('div');
            row.style.display = 'flex'
            row.style.alignItems = 'center'
            row.style.justifyContent = 'space-between'
            row.style.padding = '4px'
            row.style.cursor = 'pointer'
            row.style.border =
                this.store.getSelected()?.id === shape.id
                    ? '1px solid blue'
                    : '1px solid transparent'

            const name = document.createElement('span')
            name.textContent = shape.constructor.name
            name.onclick = () => this.store.select(shape.id)

            const eye = document.createElement('button')
            eye.innerHTML = shape.visible
                ? `<i class="ri-eye-line"></i>`
                : `<i class="ri-eye-close-line"></i>`
            eye.onclick = (e) => {
                e.stopPropagation()
                this.store.toggleVisibility(shape.id)
            }

            const del = document.createElement('button')
            del.innerHTML = '<i class="ri-delete-bin-line"></i>'
            del.onclick = (e) => {
                e.stopPropagation()
                this.store.remove(shape.id)
            }

            const actions = document.createElement('div')
            actions.style.display = 'flex'
            actions.style.gap = '6px'

            actions.appendChild(eye)
            actions.appendChild(del)

            row.appendChild(name)
            row.appendChild(actions)

            this.container.appendChild(row)
        })
    }
}