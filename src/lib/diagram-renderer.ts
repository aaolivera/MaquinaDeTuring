import Viz from 'viz.js'
import { Module, render } from 'viz.js/full.render'

import { generateVizCode, RenderOptions } from '../lib/machine-formatter'
import { Machine } from './machine-engine'


export async function generateSvgElement(machine: Machine, options: RenderOptions) {
    const code = generateVizCode(machine, options)
    const viz = new Viz({ Module, render })

    console.log(options)

    return viz.renderSVGElement(code)
}
