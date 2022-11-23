import Viz from 'viz.js'
import { Module, render } from 'viz.js/full.render'

import { generateVizCode, RenderOptions } from '../lib/machine-formatter'
import { MaquinaTuring } from "../Dominio/Clases/maquinaTuring";


export async function generateSvgElement(machine: MaquinaTuring, options: RenderOptions, estadoActual: string) {
    const code = generateVizCode(machine, options, estadoActual)
    const viz = new Viz({ Module, render })

    console.log(options)

    return viz.renderSVGElement(code)
}
