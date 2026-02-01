import './style.css'
import * as THREE from 'three'
import { Renderer } from './core/Renderer';
import { ShapeStore } from './model/ShapeStore';
import type { ToolType } from './types/ToolType';
import { Raycaster } from './core/Raycaster'
import { Toolbar } from './ui/Toolbar';
import { SaveLoad } from './ui/SaveLoad';
import { ObjectList } from './ui/ObjectList'
import { PropertyPanel } from './ui/PropertyPanel'
import { Line } from './model/shapes/Line';
import { Circle } from './model/shapes/Circle';
import { Ellipse } from './model/shapes/Ellipse';
import { Polyline } from './model/shapes/Polyline';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
console.log(canvas)
const renderer = new Renderer(canvas);
const store = new ShapeStore();


new ObjectList(
    document.getElementById('object-list')!,
    store
)
new PropertyPanel(
    document.getElementById('properties')!,
    store
)

const raycaster = new Raycaster();

let activeTool: ToolType = 'select';
let startPoint: THREE.Vector2 | null = null;

let previewShape: THREE.Object3D | null = null;
let lastSelected: THREE.Object3D | null = null;

let polylinePoints: THREE.Vector2[] = []
let polylinePreview: THREE.Line | null = null
let isDrawingPolyline = false



new Toolbar(
    document.getElementById('toolbar')!,
    tool => {
        (activeTool = tool)
    }
)

new SaveLoad(
    document.getElementById('save-load')!,
    store,
    renderer
)

function highlight(mesh: THREE.Object3D | null) {
    if (lastSelected) {
        const shape = store.findByMesh(lastSelected)
        if (shape) {
            ; (lastSelected as any).material.color.set(shape.color)
        }
    }

    if (mesh) {
        ; (mesh as any).material.color.set('#0000ff')
    }

    lastSelected = mesh
}





const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const ray = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();

function getWorldPoint(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera
): THREE.Vector2 {
    const rect = canvas.getBoundingClientRect()

    mouseNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    ray.setFromCamera(mouseNDC, camera)

    const point = new THREE.Vector3()
    ray.ray.intersectPlane(planeZ, point)

    return new THREE.Vector2(point.x, point.y)
}


canvas.addEventListener('mousedown', (e) => {


    if (activeTool === 'polyline') {
        const point = getWorldPoint(e, canvas, renderer.camera);

        polylinePoints.push(point);
        isDrawingPolyline = true;

        if (polylinePreview) {
            renderer.remove(polylinePreview)
            polylinePreview = null
        }

        if (polylinePoints.length > 1) {
            const temp = new Polyline(polylinePoints)
            polylinePreview = temp.mesh
            renderer.add(polylinePreview)
        }

        return;

    }

    if (activeTool !== 'select') {
        startPoint = getWorldPoint(e, canvas, renderer.camera)
        return;
    }

    const objects = store.getAll().map(s => s.mesh);

    const hits = raycaster.cast(
        e,
        canvas,
        renderer.camera,
        objects
    )

    if (hits.length === 0) {
        store.select(null as any);
        highlight(null);
        return;
    }

    const mesh = hits[0].object;
    const shape = store.findByMesh(mesh);

    if (shape) {
        store.select(shape.id)
        highlight(shape.mesh)
    }


})

canvas.addEventListener('mousemove', (e) => {

    const current = getWorldPoint(e, canvas, renderer.camera);

    if (activeTool === 'polyline' && isDrawingPolyline) {
        if (polylinePreview) {
            renderer.remove(polylinePreview)
            polylinePreview = null
        }

        const previewPoints = [...polylinePoints, current]
        const temp = new Polyline(previewPoints)
        polylinePreview = temp.mesh
        renderer.add(polylinePreview)
        return
    }

    if (!startPoint) return;


    if (previewShape) {
        renderer.remove(previewShape);
        previewShape = null;
    }



    if (activeTool === 'line') {
        const line = new Line(startPoint, current);

        previewShape = line.mesh;
        renderer.add(previewShape);
    }
    if (activeTool === 'circle') {
        const radius = startPoint.distanceTo(current);
        const circle = new Circle(startPoint, radius);

        previewShape = circle.mesh;
        renderer.add(previewShape);
    }

    if (activeTool === 'ellipse') {
        const radiusX = Math.abs(current.x - startPoint.x)
        const radiusY = Math.abs(current.y - startPoint.y)

        const ellipse = new Ellipse(startPoint, radiusX, radiusY)
        previewShape = ellipse.mesh
        renderer.add(previewShape)
    }
})

canvas.addEventListener('mouseup', (e) => {

    const end = getWorldPoint(e, canvas, renderer.camera);

    if (!startPoint) return;

    if (previewShape) {
        renderer.remove(previewShape)
        previewShape = null
    }

    if (activeTool === 'line') {
        const line = new Line(startPoint, end);
        store.add(line);
        renderer.add(line.mesh);
    }

    if (activeTool === 'circle') {
        const radius = startPoint.distanceTo(end);
        const circle = new Circle(startPoint, radius);
        store.add(circle);
        renderer.add(circle.mesh)
    }

    if (activeTool === 'ellipse') {
        const radiusX = Math.abs(end.x - startPoint.x)
        const radiusY = Math.abs(end.y - startPoint.y)

        const ellipse = new Ellipse(startPoint, radiusX, radiusY);
        store.add(ellipse)
        renderer.add(ellipse.mesh)
    }

    activeTool ='select'
    store.refresh();
    startPoint = null;
})

canvas.addEventListener('dblclick', () => {
    if (!isDrawingPolyline || polylinePoints.length < 2) return

    if (polylinePreview) {
        renderer.remove(polylinePreview)
        polylinePreview = null
    }

    const polyline = new Polyline([...polylinePoints])
    store.add(polyline)
    renderer.add(polyline.mesh)

    polylinePoints = []
    isDrawingPolyline = false

    activeTool = 'select'
})