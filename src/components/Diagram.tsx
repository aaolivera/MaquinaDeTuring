import React, { useEffect, useState, useRef } from 'react'
import { useAsync } from '../lib/tools'
import { generateSvgElement } from '../lib/diagram-renderer'
import { Showcase } from './Showcase'
import { parseMachine } from '../lib/parsing/parseMachine'
import { RenderOptions } from '../lib/machine-formatter'
import { MaquinaTuring } from "../Dominio/Clases/maquinaTuring";

interface DiagramPorps {
    input: string
    options: RenderOptions
    machine: MaquinaTuring
    estadoActual: string
}

export const Diagram = ({ input, options, machine, estadoActual}: DiagramPorps) => {
    const svgRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState(null);


    useAsync(async () => {
        try {
            //parseMachine(input, machine)

            const svg = await generateSvgElement(machine, options, estadoActual)
            if (svgRef.current && svg) {
                while (svgRef.current.firstChild) {
                    svgRef.current.removeChild(svgRef.current.lastChild);
                }

                svgRef.current.appendChild(svg)

                const url = `?dir=${encodeURIComponent(options.dir)}&input=${encodeURIComponent(btoa(input))}`
                window.history.pushState({}, window.document.title, url)
            }
        }
        catch (e) {
            console.error(e)
            while (svgRef.current.firstChild) {
                svgRef.current.removeChild(svgRef.current.lastChild);
            }
            svgRef.current.appendChild(document.createTextNode(String(e)))
        }
    });
    return (


        <Showcase className="diagram-container"><div ref={svgRef}></div></Showcase>


    )
}