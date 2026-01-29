import * as THREE from 'three'
import { Circle } from "../model/shapes/Circle";
import { Ellipse } from "../model/shapes/Ellipse";
import { Line } from "../model/shapes/Line";
import { Polyline } from "../model/shapes/Polyline";
import type { Shape } from "../model/shapes/Shape";

export class FileService{
    static save(
        shapes: Shape[]
    ){
        const data = {
            version: 1,
            shapes: shapes.map(s => s.toJSON())
        }

        const blob = new Blob(
            [JSON.stringify(data, null, 2)],
            {
                type: 'application/json'
            }
        )

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sketch.json';
        a.click();
    }

    static load(
        json: any,
        addShape: (shape: Shape) => void
    ) {
        json.shapes.forEach((item: any) => {
            let shape: Shape | null = null

            switch (item.type) {
                case 'line':
                    shape = new Line(
                        new THREE.Vector2(item.data.start.x, item.data.start.y),
                        new THREE.Vector2(item.data.end.x, item.data.end.y),
                        item.color
                    )
                    break

                case 'circle':
                    shape = new Circle(
                        new THREE.Vector2(item.data.center.x, item.data.center.y),
                        item.data.radius,
                        item.color
                    )
                    break

                case 'ellipse':
                    shape = new Ellipse(
                        new THREE.Vector2(item.data.center.x, item.data.center.y),
                        item.data.radiusX,
                        item.data.radiusY,
                        item.color
                    )
                    break

                case 'polyline':
                    shape = new Polyline(
                        item.data.points.map(
                            (p: any) => new THREE.Vector2(p.x, p.y)
                        ),
                        item.color
                    )
                    break
            }

            if (shape) {
                shape.visible = item.visible
                shape.mesh.visible = item.visible
                addShape(shape)
            }
        })
    }
}