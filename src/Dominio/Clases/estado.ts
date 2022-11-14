import { Transicion } from "./transicion";

export class Estado {
    private _id: number;
    private _esEstadoFinal: boolean;
    private _transiciones: Transicion[];

    public get Id(): number {
        return this._id;
    }

    public get EsEstadoFinal(): boolean {
        return this._esEstadoFinal;
    }

    public get Transiciones(): Transicion[] {
        return this._transiciones;
    }

    public constructor(id: number, esEstadoFinal: boolean) {
        this._id = id;
        this._esEstadoFinal = esEstadoFinal;
        this._transiciones = [];
    }

    public Transicionar(leido: string): Transicion | undefined {
        return this._transiciones.find(o => o.Lee === leido);
    }
}