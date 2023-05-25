import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';

export const CodeEditor = ({ value, onChange, onLoad }) => {
    useEffect(() => {
        onLoad(`
q0:q1
F:q3
q1->q1 : 0,0,R
q1->q1 : 1,1,R
q1->q1 : 2,2,R
q1->q1 : 9,9,R
q1->q2 : _,_,L
q2->q2 : 9,0,L
q2->q3 : 0,1,H
q2->q3 : 1,2,H
q2->q3 : 2,3,H
q2->q3 : _,1,H`);
    }, []);

    return <Card style={{ height: "100%" }}>
    <Card.Header style={{ backgroundColor: "#cfe2ff" }}>Editor:</Card.Header>
    <Card.Body style={{padding: "9px;" }}>
      <textarea id="textAreaInput" className="code-editor" value={value} onChange={onChange} wrap='off'
            style={{ backgroundColor: "rgb(207, 226, 255)" }} />
    </Card.Body>
  </Card>
}
