import { Estado } from "./estado";
import { Direccion } from "../Enums/direccion";

export class Transicion {
    private _destino: Estado;
    private _lee: string;
    private _dir: Direccion;
    private _escribe: string;
    private _lee2: string;
    private _dir2: Direccion;
    private _escribe2: string;

    public constructor(destino: Estado, lee: string, escribe: string, dir: Direccion, lee2: string, escribe2: string, dir2: Direccion) {
        this._destino = destino;
        this._lee = lee;
        this._escribe = escribe;
        this._dir = dir;
        this._lee2 = lee2;
        this._escribe2 = escribe2;
        this._dir2 = dir2;
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

    public get Lee2(): string {
        return this._lee2;
    }

    public get Escribe2(): string {
        return this._escribe2;
    }

    public get Dir2(): Direccion {
        return this._dir2;
    }

    public get symbols() : string{
        return (this._lee + ',' + this._escribe + ',' + (this._dir == Direccion.L ? 'L' : this._dir == Direccion.R ? 'R' : 'H'))
            + (this._lee2 ? (this._lee2 + ',' + this._escribe2 + ',' + (this._dir2 == Direccion.L ? 'L' : this._dir2 == Direccion.R ? 'R' : 'H')) : '');
    }
}