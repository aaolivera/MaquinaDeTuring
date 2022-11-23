import { Estado } from "./estado";
import { Direccion } from "../Enums/direccion";

export class Transicion {
    private _destino: Estado;
    private _lee: string;
    private _dir: Direccion;
    private _escribe: string;

    public constructor(destino: Estado, lee: string, escribe: string, dir: Direccion) {
        this._destino = destino;
        this._lee = lee;
        this._escribe = escribe;
        this._dir = dir;
    }

    public get Destino(): Estado {
        return this._destino;
    }

    public get Lee(): string {
        return this._lee;
    }

    public get Escribe(): string {
        return this._escribe;
    }

    public get Dir(): Direccion {
        return this._dir;
    }

    public get symbols() : string{
        return this._lee + ',' + this._escribe + ',' + (this._dir == Direccion.L ? 'L' : this._dir == Direccion.R ? 'R' : 'H');
    }
}