
export class MaquinaTuringModel {
    private _blanco: string;
    private _cinta: string[];
    private _cabezalPosicion: number;
    private _estadoActualId: string;
    private _finalizada: boolean;
    private _exitoso: string;
    private _leer: string;

    public get Blanco(): string {
        return this._blanco;
    }

    // 
    public get Cinta(): string[] {
        return this._cinta;
    }

    public get Finalizada(): boolean {
        return this._finalizada;
    }

    public get Exitoso(): string {
        return this._exitoso;
    }

    public get CabezalPosicion(): number {
        return this._cabezalPosicion;
    }

    public get EstadoActualId(): string {
        return this._estadoActualId;
    }
    public get Leer(): string {
        return this._leer;
    }
    //

    public constructor(cabezalPosicion: number, estadoActualId: string, blanco: string, cinta: string[], exitoso: string, finalizada: boolean, leer: string) {
        this._cabezalPosicion = cabezalPosicion;
        this._estadoActualId = estadoActualId;
        this._blanco = blanco;
        this._cinta = cinta;
        this._exitoso = exitoso;
        this._finalizada = finalizada;
        this._leer = leer;
    }

}