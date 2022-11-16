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

    public constructor(cinta: string[]) {
        this._cinta = cinta;
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

    public Transicionar(transicion: Transicion) {
        this.Escribir(transicion.Escribe);
        let posicionAnterior = this._posicion;
        this.Mover(transicion.Dir);
        this._finalizado = (posicionAnterior === this._posicion);
    }
}