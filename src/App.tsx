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
import Alert from 'react-bootstrap/Alert';
import { Split } from './components/Split'
import { CodeEditor } from './components/CodeEditor'
import { Diagram } from './components/Diagram'
import { RenderOptions } from './lib/machine-formatter'
import { parseMachine } from './lib/parsing/parseMachine'

interface AppmPorps {
    maquinaTuring: MaquinaTuring
}

export const App = ({ maquinaTuring }: AppmPorps) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [options, setOptions] = useState(new RenderOptions())
    const [maquinaTuringState, setmaquinaTuringState] = useState<MaquinaTuringModel>();

    function onChangeInput(e: any) {
        setInput(e.target.value);
        maquinaTuring.Limpiar();
        try {
            parseMachine(e.target.value, maquinaTuring)
            setError(null)
        }
        catch (e) {
            setError(String(e))
        }
        UpdateState();
    }

    function Cargar() {
        maquinaTuring.Reiniciar();
        maquinaTuring.IngresarSarta(prompt('Type here'));//prompt('Type here')
        UpdateState();
    }

    function Ejecutar() {
        maquinaTuring.Ejecutar();
        UpdateState();
    }

    function UpdateState() {
        setmaquinaTuringState(new MaquinaTuringModel(
            maquinaTuring.Cabezal.Posicion,
            maquinaTuring.EstadoActual.Id,
            maquinaTuring.Blanco,
            maquinaTuring.Cabezal.Cinta,
            maquinaTuring.Exitoso,
            maquinaTuring.Finalizada,
            maquinaTuring.Cabezal.Leer(),
            maquinaTuring.DobleCinta,
            maquinaTuring.Cabezal2.Cinta,
            maquinaTuring.Cabezal2.Posicion,
            maquinaTuring.Cabezal2.Leer()
        ));
    }
    useEffect(() => {
        UpdateState()
    }, [maquinaTuring])

    function onLoad(e) {
        setInput(e);
        maquinaTuring.Limpiar();
        try {
            parseMachine(e, maquinaTuring)
            setError(null)
        }
        catch (e) {
            setError(String(e))
        }
        UpdateState();
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
                                            <div style={{ height: "100%" }}>
                                                <CodeEditor value={input} onChange={onChangeInput} onLoad={onLoad} />
                                            </div>
                                        </div>
                                        <div className='col-10'>
                                            {error ? <Alert key={"danger"} variant={"danger"}>
                                                {error}
                                            </Alert> : <Alert key={"primary"} variant={"primary"}>
                                                <div className='row'>
                                                    <div className='col'>Q: {maquinaTuring.Estados.map(x => x.Id).join(',')}</div>
                                                    <div className='col'>Σ: {maquinaTuring.AlfabetoEntrada.join(',')}</div>
                                                    <div className='col'>Γ: {maquinaTuring.AlfabetoCinta.join(',')}</div>
                                                    <div className='col'>Δ: {maquinaTuring.Blanco}</div>
                                                    <div className='col'>q0: {maquinaTuring.EstadoInicial.Id}</div>
                                                    <div className='col'>F: {maquinaTuring.EstadosFinales.map(x => x.Id).join(',')}</div>
                                                </div>
                                            </Alert>}

                                            <Diagram input={input} options={options} machine={maquinaTuring} estadoActual={maquinaTuringState?.EstadoActualId} />
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
                                <Card.Body style={{ backgroundColor: maquinaTuringState?.Finalizada ? (maquinaTuringState?.Exitoso ? "#d1e7dd" : "#f8d7da") : "white", paddingBottom: 0 }}>
                                    <Card.Title>Estado:  {maquinaTuringState?.EstadoActualId}</Card.Title>
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
                                <Card.Body style={{ backgroundColor: maquinaTuringState?.Finalizada ? (maquinaTuringState?.Exitoso ? "#d1e7dd" : "#f8d7da") : "white" }}>
                                    <ListGroup horizontal='sm' numbered style={{ overflow: "auto" }}>
                                        {maquinaTuringState?.Cinta.map((x, index) => 
                                            <ListGroup.Item 
                                            style={{ 
                                                backgroundColor: maquinaTuringState.CabezalPosicion == index ? (maquinaTuringState?.Finalizada ? (maquinaTuringState?.Exitoso ? "#d1e7dd" : "#f8d7da") : "#fff3cd") : "white" 
                                                }}>{x}</ListGroup.Item>)}
                                    </ListGroup>
                                    {maquinaTuringState && maquinaTuringState.DobleCinta ?
                                        <ListGroup horizontal='sm' numbered style={{ overflow: "auto" }}>
                                            {maquinaTuringState?.Cinta2.map((x, index) => 
                                                <ListGroup.Item 
                                                style={{ 
                                                    backgroundColor: maquinaTuringState.Cabezal2Posicion == index ? (maquinaTuringState?.Finalizada ? (maquinaTuringState?.Exitoso ? "#d1e7dd" : "#f8d7da") : "#fff3cd") : "white" 
                                                    }}>{x}</ListGroup.Item>)}
                                        </ListGroup>:<></>
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </body>
        </div>
    );
}

