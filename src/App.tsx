import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Estado } from "./Dominio/Clases/estado";
import { Transicion } from "./Dominio/Clases/transicion";
import { Direccion } from "./Dominio/Enums/direccion";
import { MaquinaTuring } from "./Dominio/Clases/maquinaTuring";

function App() {
    let maquinaTuring: MaquinaTuring;

    function InicializarMaquina() {
        let blanco: string = '_';
        let q1: Estado = new Estado(1, false);
        let q2: Estado = new Estado(2, false);
        let q3: Estado = new Estado(3, true);

        q1.Transiciones.push(new Transicion(q1, '0', '0', Direccion.R));
        q1.Transiciones.push(new Transicion(q1, '1', '1', Direccion.R));
        q1.Transiciones.push(new Transicion(q1, '2', '2', Direccion.R));
        q1.Transiciones.push(new Transicion(q1, '9', '9', Direccion.R));
        q1.Transiciones.push(new Transicion(q2, blanco, blanco, Direccion.L));

        q2.Transiciones.push(new Transicion(q2, '9', '0', Direccion.L));

        q2.Transiciones.push(new Transicion(q3, '0', '1', Direccion.H));
        q2.Transiciones.push(new Transicion(q3, '1', '2', Direccion.H));
        q2.Transiciones.push(new Transicion(q3, '2', '3', Direccion.H));
        q2.Transiciones.push(new Transicion(q3, '3', '4', Direccion.H));
        q2.Transiciones.push(new Transicion(q3, blanco, '1', Direccion.H));

        let estados: Estado[] = [q1,q2,q3];
        maquinaTuring = new MaquinaTuring(
            ['1'],
            [blanco, '1'],
            blanco,
            estados,
            q1,
            [q3]
        );
    }

    function Cargar() {
        InicializarMaquina();
        maquinaTuring.IngresarSarta('11');
        console.log(maquinaTuring);
    }

    function Ejecutar() {
        maquinaTuring.Ejecutar();
        console.log(maquinaTuring);
    }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
          <body>
              <button className="btn btn-azul" type="button" onClick={() => Cargar()}>
                  IngresarSarta
              </button>
              <button className="btn btn-azul" type="button" onClick={() => Ejecutar()}>
                  Ejecutar
              </button>
        </body>
    </div>
  );
}

export default App;
