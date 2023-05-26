import { Direccion } from "../Enums/direccion";
import { Transicion } from "./transicion";

export class Cabezal {

    private _cinta: string[];

    private _posicion: number;

    private _finalizado: boolean;

    public get Finalizado(): boolean {
        return this._finalizado;
    }

    public get Posicion(): number {
        return this._posicion;
    }

    public get Cinta(): string[] {
        return this._cinta;
    }

    public constructor(cinta: string[]) {
        this._cinta = Object.assign([], cinta);
        this._posicion = 0;
        this._finalizado = false;
    }

    public Leer(): string {
        return this._cinta[this._posicion];
    }

    private Mover(dir: Direccion) {
        this._posicion += dir;
    }

    private Escribir(caracter: string) {
        this._cinta[this._posicion] = caracter;
    }

    public Transicionar(escribe: string, dir: Direccion) {
        let valorAnterior = this.Leer();
        let posicionAnterior = this._posicion;
        this.Escribir(escribe);
        this.Mover(dir);
        this._finalizado = (posicionAnterior === this._posicion && valorAnterior === this.Leer());
    }
}