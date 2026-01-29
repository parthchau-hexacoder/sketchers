import * as THREE from 'three'
import type { ShapeStore } from '../model/ShapeStore'
import type { Shape } from '../model/shapes/Shape'

export class PropertyPanel {
    private container: HTMLElement
    private store: ShapeStore
    private draft: any = null

    constructor(container: HTMLElement, store: ShapeStore) {
        this.container = container
        this.store = store

        this.store.subscribe(() => this.render())
        this.render()
    }

    private render() {
        const shape = this.store.getSelected()
        this.container.innerHTML = '<h3>Properties</h3>'

        if (!shape) {
            this.container.innerHTML += '<p>No object selected</p>'
            this.draft = null
            return
        }

        if (!this.draft || this.draft.id !== shape.id) {
            this.draft = this.createDraft(shape)
        }

        this.addVector2(
            'Position',
            new THREE.Vector3(this.draft.x, this.draft.y, 0),
            v => {
                this.draft.x = v.x
                this.draft.y = v.y
            }
        )

        this.addColorPicker()


        this.addShapeSpecific(shape)

        this.addVisibilityToggle(shape)
        this.addUpdateButton(shape)
        this.addDeleteButton(shape)
    }


    private createDraft(shape: any) {
        return {
            id: shape.id,
            x: shape.mesh.position.x,
            y: shape.mesh.position.y,
            color: shape.color,

            start: shape.start?.clone(),
            end: shape.end?.clone(),

            radius: shape.radius,
            radiusX: shape.radiusX,
            radiusY: shape.radiusY,

            points: shape.points
                ? shape.points.map((p: any) => p.clone())
                : null
        }
    }


    private addVector2(
        label: string,
        vec: THREE.Vector3,
        onChange: (v: THREE.Vector2) => void
    ) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = `<strong>${label}</strong><br/>`

        const x = document.createElement('input')
        const y = document.createElement('input')
        x.type = y.type = 'number'

        x.value = vec.x.toString()
        y.value = vec.y.toString()

        x.step = y.step = '0.001'

        x.oninput = y.oninput = () =>
            onChange(new THREE.Vector2(+x.value, +y.value))

        wrapper.append('X:', x, ' Y:', y)
        this.container.appendChild(wrapper)
    }

    private addVector2Editor(
        label: string,
        value: THREE.Vector2,
        onChange: (v: THREE.Vector2) => void
    ) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = `<strong>${label}</strong><br/>`

        const x = document.createElement('input')
        const y = document.createElement('input')
        x.type = y.type = 'number'

        x.value = value.x.toString()
        y.value = value.y.toString()
        
        x.step = y.step = '0.001'


        x.oninput = y.oninput = () =>
            onChange(new THREE.Vector2(+x.value, +y.value))

        wrapper.append('X:', x, ' Y:', y)
        this.container.appendChild(wrapper)
    }

    private addColorPicker() {
        const input = document.createElement('input')
        input.type = 'color'
        input.value = this.draft.color
        input.oninput = () => (this.draft.color = input.value)

        this.container.appendChild(document.createElement('hr'))
        this.container.appendChild(input)
    }

    private addVisibilityToggle(shape: Shape) {
        const btn = document.createElement('button')
        btn.innerHTML = shape.visible
            ? `<i class="ri-eye-line"></i>`
            : `<i class="ri-eye-off-line"></i>`
        btn.title = shape.visible ? 'Hide' : 'Show'



        btn.onclick = () => {
            shape.visible = !shape.visible
            shape.mesh.visible = shape.visible
            btn.innerHTML = shape.visible
                ? `<i class="ri-eye-line"></i>`
                : `<i class="ri-eye-off-line"></i>`
            btn.title = shape.visible ? 'Hide' : 'Show'

            this.store.refresh()
        }

        this.container.appendChild(btn)
    }

    private addShapeSpecific(shape: any) {
        this.container.appendChild(document.createElement('hr'))

        if ('start' in shape && 'end' in shape) {
            this.addVector2Editor(
                'Start Point',
                this.draft.start,
                v => (this.draft.start = v)
            )

            this.addVector2Editor(
                'End Point',
                this.draft.end,
                v => (this.draft.end = v)
            )
        }

        if ('radius' in shape) {
            this.addNumber(
                'Radius',
                this.draft.radius,
                v => (this.draft.radius = v)
            )
        }

        if ('radiusX' in shape && 'radiusY' in shape) {
            this.addNumber(
                'Radius X',
                this.draft.radiusX,
                v => (this.draft.radiusX = v)
            )

            this.addNumber(
                'Radius Y',
                this.draft.radiusY,
                v => (this.draft.radiusY = v)
            )
        }

        if ('points' in shape && Array.isArray(this.draft.points)) {
            this.container.appendChild(document.createElement('hr'))

            this.draft.points.forEach((p: THREE.Vector2, index: number) => {
                this.addVector2Editor(
                    `Vertex ${index + 1}`,
                    p,
                    (v) => {
                        p.x = v.x
                        p.y = v.y
                    }
                )
            })

            this.container.appendChild(document.createElement('hr'))

            const addBtn = document.createElement('button')
            addBtn.textContent = 'Add Vertex'
            addBtn.onclick = () => {
                const pts = this.draft.points
                if (pts.length >= 2) {
                    const last = pts[pts.length - 1]
                    const prev = pts[pts.length - 2]

                    const mid = new THREE.Vector2(
                        (last.x + prev.x) / 2,
                        (last.y + prev.y) / 2
                    )
                    pts.push(mid)
                    this.render()
                }
            }

            const removeBtn = document.createElement('button')
            removeBtn.textContent = 'Remove Last Vertex'
            removeBtn.onclick = () => {
                if (this.draft.points.length > 2) {
                    this.draft.points.pop()
                    this.render()
                }
            }

            this.container.append(addBtn, removeBtn)
        }

    }

    private addNumber(
        label: string,
        value: number,
        onChange: (v: number) => void
    ) {
        const input = document.createElement('input')
        input.type = 'number'
        input.value = value?.toString() ?? '0'
        input.oninput = () => onChange(+input.value)

        this.container.append(label + ': ', input, document.createElement('br'))
    }


    private addUpdateButton(shape: any) {
        const btn = document.createElement('button')
        btn.textContent = 'Update'

        btn.onclick = () => {
            shape.mesh.position.set(this.draft.x, this.draft.y, 0)

            shape.setColor(this.draft.color)

            if ('start' in shape && 'end' in shape) {
                shape.update({
                    start: this.draft.start,
                    end: this.draft.end
                })
            }

            if ('radius' in shape) {
                shape.update({ radius: this.draft.radius })
            }

            if ('radiusX' in shape && 'radiusY' in shape) {
                shape.update({
                    radiusX: this.draft.radiusX,
                    radiusY: this.draft.radiusY
                })
            }

            if (Array.isArray(this.draft.points)) {
                shape.points = this.draft.points.map((p: THREE.Vector2) => p.clone())
                shape.rebuild();

                this.store.select(shape.id)
            }
        }

        this.container.appendChild(document.createElement('hr'))
        this.container.appendChild(btn)
    }

    private addDeleteButton(shape: Shape) {
        const btn = document.createElement('button')
        btn.innerHTML = '<i class="ri-delete-bin-line"></i> Delete'
        btn.style.color = 'red'
        btn.style.display = 'flex'
        btn.style.alignItems = 'center'
        btn.style.justifyContent = 'center'
        btn.style.gap = '8px'

        btn.onclick = () => {
            this.store.remove(shape.id)
            this.store.refresh();
        }

        this.container.appendChild(btn)
    }
}
