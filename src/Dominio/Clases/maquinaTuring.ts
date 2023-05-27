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
    private _cabezal2: Cabezal;
    private _estadoActual: Estado;
    private _estadoInicial: Estado;
    private _finalizada: boolean;
    private _exitoso: boolean;
    private _dobleCinta: boolean;

    // 
    public get Estados(): Estado[] {
        return this._estados;
    }

    public get EstadosFinales(): Estado[] {
        return this._estadosFinales;
    }

    // 
    public get AlfabetoEntrada(): string[] {
        return this._alfabetoEntrada;
    }

    public get AlfabetoCinta(): string[] {
        return this._alfabetoCinta;
    }

    public get Blanco(): string {
        return this._blanco;
    }

    public setDobleCinta(dobleCinta: boolean) {
        this._dobleCinta = dobleCinta;
    }

    public setBlanco(blanco: string) {
        this._blanco = blanco;
        for (let i = 0; (i < 100); i++) {
            this.Cinta[i] = blanco;
        }
    }

    // 
    private get Cinta(): string[] {
        return this._cinta;
    }

    public get Cabezal(): Cabezal {
        return this._cabezal;
    }

    public get Cabezal2(): Cabezal {
        return this._cabezal2;
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

    public get DobleCinta(): boolean {
        return this._dobleCinta;
    }

    public get Exitoso(): boolean {
        return this._exitoso;
    }

    public get Inicializada(): boolean {
        return this._estadosFinales.length > 0;
    }

    //

    public constructor() {
        this._blanco = '_';
        this._dobleCinta = false;
        this.Limpiar();
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
        this._cabezal2 = new Cabezal(this.Cinta);
    }

    public Reiniciar(){
        this._estadoActual = this._estadoInicial;
        for (let i = 0; (i < 100); i++) {
            this.Cinta[i] = this.Blanco;
        }
        this._exitoso = false;
        this._finalizada = false;
        this._cabezal = new Cabezal(this.Cinta);
        this._cabezal2 = new Cabezal(this.Cinta);
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
        this._dobleCinta = this._dobleCinta || transicion.Lee2 != undefined;
        if(source.Transiciones.some(x => x.Lee == transicion.Lee && (x.Lee2 == transicion.Lee2 || transicion.Lee2 == '*'))){
            return false; //No se soportan Automatas no deterministicos
        }
        source.Transiciones.push(transicion);
        if(this._alfabetoCinta.indexOf(transicion.Escribe) === -1 && transicion.Escribe && transicion.Escribe != '*') this._alfabetoCinta.push(transicion.Escribe)
        if(this._alfabetoCinta.indexOf(transicion.Escribe2) === -1 && transicion.Escribe2 && transicion.Escribe2 != '*') this._alfabetoCinta.push(transicion.Escribe2)
        if(this._alfabetoEntrada.indexOf(transicion.Lee) === -1 && transicion.Lee) this._alfabetoEntrada.push(transicion.Lee)
      //  if(this._alfabetoEntrada.indexOf(transicion.Lee2) === -1 && transicion.Lee2) this._alfabetoEntrada.push(transicion.Lee2)
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
        let leido2 = this.Cabezal2.Leer();
        let transicion = this.EstadoActual.Transicionar(leido, leido2);
        if ((transicion == null)) {
            this._finalizada = true;
        }
        else {
            this.Cabezal.Transicionar(transicion.Escribe == '*' ? leido : transicion.Escribe, transicion.Dir);
            if(transicion.Lee2){
                this.Cabezal2.Transicionar(transicion.Escribe2 == '*' ? leido2 : transicion.Escribe2, transicion.Dir2);
            }
            this._finalizada = this.Cabezal.Finalizado && this.Cabezal2.Finalizado;
            this._estadoActual = transicion.Destino;
            this._exitoso = this.EstadosFinales.includes(this.EstadoActual);
        }

    }

}