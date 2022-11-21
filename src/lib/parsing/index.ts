import { Context } from './Context'
import { Machine, StateData } from '../machine-engine'
import { Source, Location } from './Source'

export function parseMachine(input: string): Machine {
    const machine = new Machine()
    const source = new Source(input)
    const ctx = new Context(source, machine)

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

    return machine
}

function isInitial(ctx: Context){
    if (ctx.source.pullToken('->')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function isInitialAccepted(ctx: Context){
    if (ctx.source.pullToken('=>')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function getSources(ctx: Context, initial:boolean, accepted:boolean){
    const sources: StateData[] = []
    
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
        
        sources.push({ name, initial, accepted })
        
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

function istransitionMode(ctx: Context){
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
    return { name, initial: null, accepted: null };
}

function getSymbol(ctx: Context){
    const symbol = ctx.source.pullText(['\n'])
    if (symbol === null) {
        throw ctx.source.error('Expected transition symbols.')
    }

    var matchs = symbol.match(/^([1-9]|[1-9][0-9]|100|0|_),([1-9]|[1-9][0-9]|100|0|_),(L|R|H)$/);
    if(matchs){
        return [matchs[1], matchs[2], matchs[3]];
    }        
    throw ctx.source.error('Expected Symbol <num>,<num>,<L R H>. :<' + symbol+'>')

}

function parseStates(ctx: Context): boolean {
    return ctx.source.transaction(() => {
        let accepted =  isInitialAccepted(ctx);
        let initial = accepted || isInitial(ctx);
        let sources = getSources(ctx, accepted, initial);
        
        if(sources === false || sources.length === 0) return false;
        
        if (istransitionMode(ctx)) {
            if (sources.length > 1) {
                throw ctx.source.error('Expected one source state name.')
            }
            
            let target = getTarget(ctx);

            if (!ctx.source.pullToken(':')) {
                throw ctx.source.error('Expected transition symbols.')
            }
            ctx.source.skipSpaces()

            const symbol = getSymbol(ctx);

            ctx.source.skipSpaces()

            const mSource = ctx.machine.state(sources[0])
            const mTarget = ctx.machine.state(target)

            ctx.machine.transition(mSource, mTarget, symbol)
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
                state.label = label
                state.accepted = accepted
                
                ctx.machine.state(state)
            }
        }

        return true
    })
}
