import React, { useState, useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Estado } from "./Dominio/Clases/estado";
import { Transicion } from "./Dominio/Clases/transicion";
import { Direccion } from "./Dominio/Enums/direccion";
import { MaquinaTuring } from "./Dominio/Clases/maquinaTuring";
import { Cabezal } from './Dominio/Clases/cabezal';
import { MaquinaTuringModel } from './Dominio/Models/maquinaTuringModel';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Split } from './components/Split'
import { CodeEditor } from './components/CodeEditor'
import { Diagram } from './components/Diagram'
import { RenderOptions } from './lib/machine-formatter'

function App() {
    const [input, setInput] = useState("");
    const [options, setOptions] = useState(new RenderOptions())
    const [maquinaTuring] = useState<MaquinaTuring>(new MaquinaTuring());
    const [maquinaTuringState, setmaquinaTuringState] = useState<MaquinaTuringModel>();

    function setMachine(m: any) {
        console.log(m);
       
    }

    function onChangeInput(e: any) {
        console.log(e)
        setInput(e.target.value)
    }

    function InicializarMaquina() {
        let blanco: string = 'β';
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

        let estados: Estado[] = [q1, q2, q3];
        maquinaTuring.Inicializar(
            ['1', '2', '3','9'],
            [blanco, '1', '2', '3','9'],
            blanco,
            estados,
            q1,
            [q3]
        );
    }

    function Cargar() {
        maquinaTuring.IngresarSarta('1199');
        console.log(maquinaTuring);
        UpdateState();
    }

    function Ejecutar() {
        maquinaTuring.Ejecutar();
        console.log(maquinaTuring);
        UpdateState();
    }

    function UpdateState() {
        setmaquinaTuringState(new MaquinaTuringModel(
            maquinaTuring.Cabezal.Posicion,
            maquinaTuring.EstadoActual.Id,
            maquinaTuring.Blanco,
            maquinaTuring.Cinta,
            maquinaTuring.Exitoso.toString(),
            maquinaTuring.Finalizada,
            maquinaTuring.Cabezal.Leer()
        ));
    }

    return (
        <div className="App">
            <body>
                <div className="container-fluid box">
                    <div className="row content">
                        <div className="col-12">
                            <Card style={{ marginTop: "15px", height: "95%" }}>
                                <Card.Header as="h5" style={{ backgroundColor: "#cfe2ff" }}>Máquina de turing</Card.Header>
                                <Card.Body>
                                    <div className='row' style={{ height: "100%" }}>
                                        <div className='col-2 col-2-mod diagram-panel split-dir-v split-start'>
                                            <CodeEditor value={input} onChange={onChangeInput} />
                                        </div>
                                        <div className='col-10'>
                                            <Diagram input={input} options={options} machineSetter={setMachine} estadoActual={maquinaTuringState?.EstadoActualId} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    <div className="row header">
                        <div className="col-2" style={{ marginBottom: "15px" }}>
                            <Card style={{ marginBottom: "15px", height: "100%" }}>
                                <Card.Header as="h5" style={{ backgroundColor: "#cfe2ff" }}>Cabezal</Card.Header>
                                <Card.Body style={{ backgroundColor: maquinaTuringState?.Finalizada ? "#d1e7dd" : "white", paddingBottom:0 }}>
                                    <Card.Title>Estado:  q{maquinaTuringState?.EstadoActualId}</Card.Title>
                                    <Card.Text>Actual:  {maquinaTuringState?.Leer}</Card.Text>
                                    <div className="row">
                                        <div className="col-6">
                                            <Button variant="primary" size="sm" onClick={() => Cargar()}>
                                                IngresarSarta
                                            </Button></div>
                                        <div className="col-6">
                                            <Button variant="primary" size="sm" onClick={() => Ejecutar()}>
                                                Ejecutar
                                            </Button></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-10" style={{ marginBottom: "15px" }}>
                            <Card style={{ marginBottom: "15px", height: "100%" }}>
                                <Card.Header as="h5" style={{ backgroundColor: "#cfe2ff" }}>Cinta</Card.Header>
                                <Card.Body style={{ backgroundColor: maquinaTuringState?.Finalizada ? "#d1e7dd" : "white" }}>
                                    <ListGroup horizontal='sm' numbered style={{ overflow: "auto" }}>
                                        {maquinaTuringState?.Cinta.map((x, index) => <ListGroup.Item style={{ backgroundColor: maquinaTuringState.CabezalPosicion == index ? "#d1e7dd" : "white" }}>{x}</ListGroup.Item>)}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>


            </body>
        </div>
    );
}

export default App;
