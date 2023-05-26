
export class MaquinaTuringModel {
    private _blanco: string;
    private _cinta: string[];
    private _cabezalPosicion: number;
    private _estadoActualId: string;
    private _finalizada: boolean;
    private _exitoso: boolean;
    private _leer: string;
    private _cinta2: string[];
    private _cabezal2Posicion: number;
    private _leer2: string;
    private _dobleCinta: boolean;

    public get Blanco(): string {
        return this._blanco;
    }

    public get Cinta(): string[] {
        return this._cinta;
    }

    public get Cinta2(): string[] {
        return this._cinta2;
    }

    public get Finalizada(): boolean {
        return this._finalizada;
    }

    public get Exitoso(): boolean {
        return this._exitoso;
    }

    public get CabezalPosicion(): number {
        return this._cabezalPosicion;
    }

    public get Cabezal2Posicion(): number {
        return this._cabezal2Posicion;
    }

    public get EstadoActualId(): string {
        return this._estadoActualId;
    }
    public get Leer(): string {
        return this._leer;
    }
    public get Leer2(): string {
        return this._leer2;
    }
    
    public get DobleCinta(): boolean {
        return this._dobleCinta;
    }
    //

    public constructor(cabezalPosicion: number, estadoActualId: string, blanco: string, cinta: string[], exitoso: boolean, finalizada: boolean, leer: string, dobleCinta: boolean, cinta2: string[], cabezal2Posicion: number, leer2: string) {
        this._cabezalPosicion = cabezalPosicion;
        this._estadoActualId = estadoActualId;
        this._blanco = blanco;
        this._cinta = cinta;
        this._exitoso = exitoso;
        this._finalizada = finalizada;
        this._leer = leer;
        this._cinta2 = cinta2;
        this._cabezal2Posicion = cabezal2Posicion;
        this._leer2 = leer2;
        this._dobleCinta = dobleCinta;
    }

}