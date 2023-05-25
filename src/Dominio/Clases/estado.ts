import { Transicion } from "./transicion";

export class Estado {
    private _id: string;
    private _esEstadoFinal: boolean;
    private _esEstadoInicial: boolean;
    private _transiciones: Transicion[];

    public get Id(): string {
        return this._id;
    }

    public set EsEstadoFinal(value) {
        this._esEstadoFinal = value;
    }
    public set EsEstadoInicial(value) {
        this._esEstadoInicial = value;
    }
    public get EsEstadoFinal(): boolean {
        return this._esEstadoFinal;
    }

    public get EsEstadoInicial(): boolean {
        return this._esEstadoInicial;
    }

    

    public get Transiciones(): Transicion[] {
        return this._transiciones;
    }

    public constructor(id: string, esEstadoFinal: boolean, esEstadoInicial: boolean) {
        this._id = id;
        this._esEstadoFinal = esEstadoFinal;
        this._esEstadoInicial = esEstadoInicial;
        this._transiciones = [];
    }

    public Transicionar(leido: string, leido2: string): Transicion | undefined {
        return this._transiciones.find(o => o.Lee === leido && (!o.Lee2 || o.Lee2 === leido2));
    }
}