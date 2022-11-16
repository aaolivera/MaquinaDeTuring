import { Estado } from "./estado";
import { Cabezal } from "./cabezal";

export class MaquinaTuring {
    private _estados: Estado[];
    private _estadosFinales: Estado[];
    private _alfabetoEntrada: string[];
    private _alfabetoCinta: string[];
    private _blanco: string;
    private _cinta: string[];
    private _cabezal: Cabezal;
    private _estadoActual: Estado;
    private _finalizada: boolean;
    private _exitoso: boolean;

    // 
    public get Estados(): Estado[] {
        return this._estados;
    }

    private get EstadosFinales(): Estado[] {
        return this._estadosFinales;
    }

    // 
    private get AlfabetoEntrada(): string[] {
        return this._alfabetoEntrada;
    }

    private get AlfabetoCinta(): string[] {
        return this._alfabetoCinta;
    }

    public get Blanco(): string {
        return this._blanco;
    }

    // 
    public get Cinta(): string[] {
        return this._cinta;
    }

    public get Cabezal(): Cabezal {
        return this._cabezal;
    }

    public get EstadoActual(): Estado {
        return this._estadoActual;
    }

    public get Finalizada(): boolean {
        return this._finalizada;
    }

    public get Exitoso(): boolean {
        return this._exitoso;
    }

    public get Inicializada(): boolean {
        return this._estadosFinales.length > 0;
    }

    //

    public constructor() {
        this._alfabetoCinta = [];
        this._alfabetoEntrada = [];
        this._blanco = '';
        this._estados = [];
        this._estadoActual = new Estado(0,false);
        this._estadosFinales = [];
        this._cinta = [];
        this._exitoso = false;
        this._finalizada = false;
        this._cabezal = new Cabezal(this.Cinta);
    }

    public Inicializar(alfabetoEntrada: string[], alfabetoCinta: string[], blanco: string, estados: Estado[], estadoInicial: Estado, estadosFinales: Estado[]) {
        this._alfabetoCinta = alfabetoCinta;
        this._alfabetoEntrada = alfabetoEntrada;
        this._blanco = blanco;
        this._estados = estados;
        this._estadoActual = estadoInicial;
        this._estadosFinales = estadosFinales;
        this._cinta = [];
        for (let i = 0; (i < 100); i++) {
            this.Cinta[i] = this.Blanco;
        }
        this._exitoso = false;
        this._finalizada = false;
        this._cabezal = new Cabezal(this.Cinta);
    }

    public IngresarSarta(sarta: string): boolean {
        let sartaList: string[];
        sartaList = sarta.split('');
        if (sartaList.some(x => !this.AlfabetoEntrada.includes(x))) {
            return false;
        }
        this.Cinta.splice(0, sartaList.length, ...sartaList);
        this._cabezal = new Cabezal(this.Cinta);
        this._exitoso = false;
        this._finalizada = false;
        return true;
    }

    public Ejecutar() {
        if (this.Finalizada) {
            return;
        }

        let leido = this.Cabezal.Leer();
        let transicion = this.EstadoActual.Transicionar(leido);
        if ((transicion == null)) {
            this._finalizada = true;
        }
        else {
            this.Cabezal.Transicionar(transicion);
            this._finalizada = this.Cabezal.Finalizado;
            this._estadoActual = transicion.Destino;
            this._exitoso = this.EstadosFinales.includes(this.EstadoActual);
        }

    }

}