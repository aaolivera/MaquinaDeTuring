import Viz from 'viz.js'
import { Module, render } from 'viz.js/full.render'

import { generateVizCode, RenderOptions } from '../lib/machine-formatter'
import { Machine } from './machine-engine'


export async function generateSvgElement(machine: Machine, options: RenderOptions, estadoActual: number) {
    const code = generateVizCode(machine, options, estadoActual)
    const viz = new Viz({ Module, render })

    console.log(options)

    return viz.renderSVGElement(code)
}
