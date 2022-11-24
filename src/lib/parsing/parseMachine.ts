import { Context } from './Context'
import { Source, Location } from './Source'
import { MaquinaTuring } from "../../Dominio/Clases/maquinaTuring";
import { Estado } from "../../Dominio/Clases/estado";
import { Transicion } from "../../Dominio/Clases/transicion";
import { Direccion } from "../../Dominio/Enums/direccion";

export function parseMachine(input: string, machine: MaquinaTuring) {
    const source = new Source(input)
    const ctx = new Context(source, machine)
        let blanco: string = '_';

    machine.setBlanco(blanco);
    let lastLocation: Location = null

    while (source.isAlive()) {
        source.skipLines()

        const location = source.getLocation()
        const active = (
            parseStates(ctx) ||
            false
        )

        if (active) {
            if (lastLocation !== null && lastLocation.line === location.line) {
                throw source.error('Expected line break', location)
            }

            lastLocation = location
        }
        else {
            break
        }
    }

    if (source.isAlive()) {
        throw source.error('Invalid syntax')
    }
}

function parseStates(ctx: Context): boolean {
    return ctx.source.transaction(() => {
        let accepted =  isInitialAccepted(ctx);
        let initial = accepted || isInitial(ctx);
        let sources = getSources(ctx, accepted, initial);
        
        if(sources === false || sources.length === 0) return false;
        if (initial && (sources.length > 1 || ctx.machine.EstadoInicial.Id != '0')) {
            throw ctx.source.error('Expected one source state name.')
        }

        if (istransitionMode(ctx)) {
            let target = getTarget(ctx);

            if (!ctx.source.pullToken(':')) {
                throw ctx.source.error('Expected transition symbols.')
            }
            ctx.source.skipSpaces()

            const transicion = getTransicion(ctx, target);
            ctx.machine.IngresarEstado(sources[0]);
            ctx.machine.IngresarEstado(target);
            if(!ctx.machine.IngresarTransicion(sources[0], transicion)){
                throw ctx.source.error('Only deterministic automata are supported.')
            }            
            ctx.source.skipSpaces()
        }
        else {
            let label: string

            if (ctx.source.pullToken(':')) {
                ctx.source.skipSpaces()

                label = ctx.source.pullText(['\n'])

                if (label === null) {
                    throw ctx.source.error('Expected state label.')
                }
            }
    
            if (ctx.source.pullToken('<=')) {
                accepted = true
            }

            for (const state of sources) {
                state.EsEstadoFinal = accepted;
                ctx.machine.IngresarEstado(state);
            }
        }

        return true
    })
}


function isInitial(ctx: Context) : boolean{
    if (ctx.source.pullToken('->')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function isInitialAccepted(ctx: Context) : boolean{
    if (ctx.source.pullToken('=>')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function getSources(ctx: Context, accepted:boolean, initial:boolean){
    const sources: Estado[] = []
    
    while (true) {
        const name = ctx.source.pullName()
        if (name === null) {
            if (sources.length === 0 && !initial && !accepted) {
                return false
            }
            else {
                throw ctx.source.error('Expected state name.')
            }
        }
        var estado = ctx.machine.Estados.find(x => x.Id == name) || new Estado(name, accepted, initial) ;
        estado.EsEstadoFinal = estado.EsEstadoFinal || accepted
        estado.EsEstadoInicial = estado.EsEstadoInicial || initial
        sources.push(estado)
        
        ctx.source.skipSpaces()
         if (ctx.source.pullToken(',')) {
             ctx.source.skipLines()
         }
         else {
             break
         }
    }
    return sources;
}

function istransitionMode(ctx: Context) : boolean{
    let transitionMode = false

    if (ctx.source.pullToken('->')) {
        transitionMode = true
    }
    return transitionMode;
}

function getTarget(ctx: Context){
    ctx.source.skipSpaces()

    const name = ctx.source.pullName()
    if (name === null) {
        throw ctx.source.error('Expected target state name.')
    }

    ctx.source.skipSpaces()
    return ctx.machine.Estados.find(x => x.Id == name) || new Estado(name, false, false);
}

function getTransicion(ctx: Context, target : Estado ) : Transicion{
    const symbol = ctx.source.pullText(['\n'])
    if (symbol === null) {
        throw ctx.source.error('Expected transition symbols.')
    }

    var matchs = symbol.match(/^([1-9]|[1-9][0-9]|100|0|_),([1-9]|[1-9][0-9]|100|0|_),(L|R|H)$/);
    if(matchs){
        return new Transicion(target, matchs[1], matchs[2], matchs[3] == 'R' ? Direccion.R : matchs[3] == 'L' ? Direccion.L : Direccion.H);
    }
    throw ctx.source.error('Expected Symbol <num>,<num>,<L R H>. :<' + symbol+'>')
}
