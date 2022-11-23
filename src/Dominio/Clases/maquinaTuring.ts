import { Estado } from "./estado";
import { Cabezal } from "./cabezal";
import { Transicion } from "./transicion";

export class MaquinaTuring {
    private _estados: Estado[];
    private _estadosFinales: Estado[];
    private _alfabetoEntrada: string[];
    private _alfabetoCinta: string[];
    private _blanco: string;
    private _cinta: string[];
    private _cabezal: Cabezal;
    private _estadoActual: Estado;
    private _estadoInicial: Estado;
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

    public set Blanco(value) {
        this._blanco = value;
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

    public get EstadoInicial(): Estado {
        return this._estadoInicial;
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
        console.log("construye")
        this._alfabetoCinta = [];
        this._alfabetoEntrada = [];
        this._estados = [];
        this._estadoActual = this._estadoInicial = new Estado('0',false, false);
        this._estadosFinales = [];
        this._cinta = [];
        this._blanco = '_';
        for (let i = 0; (i < 100); i++) {
            this.Cinta[i] = this._blanco;
        }
        this._exitoso = false;
        this._finalizada = false;
        this._cabezal = new Cabezal(this.Cinta);
    }

    public Inicializar(blanco: string) {
        this._blanco = blanco;
        for (let i = 0; (i < 100); i++) {
            this.Cinta[i] = blanco;
        }
    }

    public Limpiar(){
        this._alfabetoCinta = [];
        this._alfabetoEntrada = [];
        this._estados = [];
        this._estadoActual = this._estadoInicial = new Estado('0',false, false);
        this._estadosFinales = [];
        this._cinta = [];
        for (let i = 0; (i < 100); i++) {
            this.Cinta[i] = this.Blanco;
        }
        this._exitoso = false;
        this._finalizada = false;
        this._cabezal = new Cabezal(this.Cinta);
    }

    public IngresarEstado (estado : Estado){
        if(!this._estados.some(x => x.Id == estado.Id)){
            this._estados.push(estado);
        }
        if(estado.EsEstadoFinal && !this._estadosFinales.some(x => x.Id == estado.Id)){
            this._estadosFinales.push(estado);
        }
        if(estado.EsEstadoInicial){
            this._estadoActual = estado;
            this._estadoInicial = estado;
        }
    }

    public IngresarTransicion (source : Estado, transicion : Transicion) : boolean{
        if(source.Transiciones.some(x => x.Lee == transicion.Lee)){
            return false; //No se soportan Automatas no deterministicos
        }
        source.Transiciones.push(transicion);
        if(this._alfabetoCinta.indexOf(transicion.Escribe) === -1) this._alfabetoCinta.push(transicion.Escribe)
        if(this._alfabetoEntrada.indexOf(transicion.Lee) === -1) this._alfabetoEntrada.push(transicion.Lee)
        return true;
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