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

    if (ctx.machine.EstadoInicial.Id == '0') {
        throw ctx.source.error('Se espera un estado inicial. (ej q0: q2)')
    }

    if (ctx.machine.EstadosFinales.length == 0) {
        throw ctx.source.error('Se espera al menos un estado final. (ej F: q3,q4,q5)')
    }

    if (source.isAlive()) {
        throw source.error('Invalid syntax')
    }
}

function parseStates(ctx: Context): boolean {
    return ctx.source.transaction(() => {
        let accepted = isAccepted(ctx);
        let initial = isInitial(ctx);
        let white = isWhite(ctx);
        let sources = getSources(ctx, accepted, initial, white);
        let estados: Estado[] = sources;

        if (sources === false || sources.length === 0) return false;
        if (initial && (sources.length > 1 || ctx.machine.EstadoInicial.Id != '0')) {
            throw ctx.source.error('Se espera un único estado inicial.')
        }

        if (white) {
            ctx.machine.setBlanco(sources[0]);
        } else if (istransitionMode(ctx)) {
            let target = getTarget(ctx);

            if (!ctx.source.pullToken(':')) {
                throw ctx.source.error('1Se espera que se defina la transcición: q1->q2 : Σ,Γ,<L R H>  o  q1->q2 : Σ,Γ,<L R H>;Σ,Γ,<L R H>.')
            }
            ctx.source.skipSpaces()

            const transicion = getTransicion(ctx, target);
            ctx.machine.IngresarEstado(estados[0]);
            ctx.machine.IngresarEstado(target);
            if (!ctx.machine.IngresarTransicion(estados[0], transicion)) {
                throw ctx.source.error(`Solo soporta autómatas determinísticos: <${estados[0].Id}->${transicion.Destino}:${transicion.Lee},${transicion.Escribe},${transicion.Dir}>`)
            }
            ctx.source.skipSpaces()
        }
        else {
            for (const state of estados) {
                state.EsEstadoFinal = accepted;
                ctx.machine.IngresarEstado(state);
            }
        }

        return true
    })
}


function isAccepted(ctx: Context): boolean {
    if (ctx.source.pullToken('F:')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function isInitial(ctx: Context): boolean {
    if (ctx.source.pullToken('q0:')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function isWhite(ctx: Context): boolean {
    if (ctx.source.pullToken('Δ:')) {
        ctx.source.skipSpaces()
        return true;
    }
    return false;
}

function getSources(ctx: Context, accepted: boolean, initial: boolean, white: boolean): any {
    const sources: Estado[] = []

    while (true) {
        const name = white ? ctx.source.pullWhite() : ctx.source.pullName()
        if (name === null) {
            if (sources.length === 0 && !initial && !accepted && !white) {
                return false
            }
            else if (white) {
                throw ctx.source.error('Se espera el caracter blanco de la maquina.')
            }
            else {
                throw ctx.source.error('Se espera el nombre del estado.')
            }
        }

        if (white) {
            return name[0];
        } else {
            var estado = ctx.machine.Estados.find(x => x.Id == name) || new Estado(name, accepted, initial);
            estado.EsEstadoFinal = estado.EsEstadoFinal || accepted
            estado.EsEstadoInicial = estado.EsEstadoInicial || initial
            sources.push(estado)
        }

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

function istransitionMode(ctx: Context): boolean {
    let transitionMode = false

    if (ctx.source.pullToken('->')) {
        transitionMode = true
    }
    return transitionMode;
}

function getTarget(ctx: Context) {
    ctx.source.skipSpaces()

    const name = ctx.source.pullName()
    if (name === null) {
        throw ctx.source.error('Se espera el nombre del estado destino.')
    }

    ctx.source.skipSpaces()
    return ctx.machine.Estados.find(x => x.Id == name) || new Estado(name, false, false);
}

function getTransicion(ctx: Context, target: Estado): Transicion {
    const symbol = ctx.source.pullText(['\n'])
    if (symbol === null) {
        throw ctx.source.error('2Se espera que se defina la transcición: q1->q2 : Σ,Γ,<L R H>  o  q1->q2 : Σ,Γ,<L R H>;Σ,Γ,<L R H>.')
    }
    //un cabezal
    var matchs = symbol.match(`^([A-Za-z0-9${ctx.machine.Blanco}*]),([A-Za-z0-9${ctx.machine.Blanco}*]),(L|R|H)(;([A-Za-z0-9${ctx.machine.Blanco}*]),([A-Za-z0-9${ctx.machine.Blanco}*]),(L|R|H)){0,1}$`);

    var cabezal1Lee = matchs[1];
    var cabezal1Escribe = matchs[2];
    var cabezal1Direccion = matchs[3] == 'R' ? Direccion.R : matchs[3] == 'L' ? Direccion.L : Direccion.H;
    var cabezal2Lee = matchs[5];
    var cabezal2Escribe = matchs[6];
    var cabezal2Direccion = matchs[7] == 'R' ? Direccion.R : matchs[7] == 'L' ? Direccion.L : Direccion.H;
    //dos cabezales
    if (matchs) {
        return new Transicion(target, cabezal1Lee, cabezal1Escribe, cabezal1Direccion, cabezal2Lee, cabezal2Escribe, cabezal2Direccion);
    }
    throw ctx.source.error('3Se espera que se defina la transcición: q1->q2 : Σ,Γ,<L R H>  o  q1->q2 : Σ,Γ,<L R H>;Σ,Γ,<L R H>:  ' + symbol)
}
