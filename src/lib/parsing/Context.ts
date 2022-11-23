import { Source } from './Source'
import { MaquinaTuring } from "../../Dominio/Clases/maquinaTuring";


export class Context {

    source: Source
    machine: MaquinaTuring

    constructor(source: Source, machine: MaquinaTuring) {
        this.source = source;
        this.machine = machine
    }

}