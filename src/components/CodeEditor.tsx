import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';

export const CodeEditor = ({ value, onChange, onLoad }) => {
    useEffect(() => {
        onLoad(`
q0:q1
F:q1,q2,q3,q4,q5,q6
q1->q2 : A,A,R;_,A,R
q1->q4 : B,B,R;_,B,R

q2->q5 : A,A,R;_,2,H
q5->q5 : A,A,R;2,3,H
q5->q5 : A,A,R;3,4,H
q5->q5 : A,A,R;4,5,H

q5->q3 : B,B,H;*,*,R
q2->q4 : B,B,R;_,B,R

q3->q4 : B,B,R;_,B,R

q4->q6 : B,B,R;_,2,H
q6->q6 : B,B,R;2,3,H
q6->q6 : B,B,R;3,4,H
q6->q6 : B,B,R;4,5,H

q6->q1 : A,A,H;*,*,R
q4->q2 : A,A,R;_,A,R`);
    }, []);

    return <Card style={{ height: "100%" }}>
    <Card.Header style={{ backgroundColor: "#cfe2ff" }}>Editor:</Card.Header>
    <Card.Body style={{padding: "9px;" }}>
      <textarea id="textAreaInput" className="code-editor" value={value} onChange={onChange} wrap='off'
            style={{ backgroundColor: "rgb(207, 226, 255)" }} />
    </Card.Body>
  </Card>
}
