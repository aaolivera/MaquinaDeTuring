import { MaquinaTuring } from "../Dominio/Clases/maquinaTuring";
import { Graph, Node, Edge, DotWriter } from './dot'

export class RenderOptions {

    dir: string
    ignoreActions: boolean

    constructor() {
        this.dir = 'LR'
        this.ignoreActions = false
    }

    patch({ dir = null, ignoreActions = null }): RenderOptions {
        const o = new RenderOptions()

        o.dir = dir ?? this.dir
        o.ignoreActions = ignoreActions ?? this.ignoreActions

        return o
    }

}

export function generateVizCode(machine: MaquinaTuring, options: RenderOptions, estadoActual: string): string {
    const graph = new Graph()

    graph.rankdir = options.dir

    for (const state of machine.Estados) {
        const node = graph.createNode(state.Id)
        node.label = state.Id
        node.shape = (state.EsEstadoFinal ? 'doublecircle' : 'circle')
        if(state.Id == estadoActual){
            node.fillcolor = '#d1e7dd'
            node.style = 'filled'
        }

        let source = state.Id
        let target = null
        let symbol: string = '';
        for (const transition of state.Transiciones.sort((a, b) => a.Destino.Id.localeCompare(b.Destino.Id))) {
            if(target && target.Id != transition.Destino.Id ){
                const symbolEdge = graph.createEdge(source, target.Id)
                symbolEdge.label = symbol
                target = null;
                symbol = '';
            }
            if(!target || target.Id == transition.Destino.Id){
                symbol += transition.symbols + '\n';
                target = transition.Destino;
            }
        }
        if(target){
            const symbolEdge = graph.createEdge(source, target.Id)
            symbolEdge.label = symbol
            target = null;
        }
    }

    for (const state of machine.Estados.filter(s => s.EsEstadoInicial)) {
        const initialName = graph.nextName(state.Id)
        const initialNode = graph.createNode(initialName)
        initialNode.shape = 'point'
        initialNode.label = ''

        graph.createEdge(initialName, state.Id)
    }

    const writer = new DotWriter()
    graph.render(writer)
    return writer.getCode()
}
