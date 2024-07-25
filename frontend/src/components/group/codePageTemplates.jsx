import React from 'react';
import { FaPython } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
const CodePageTemplates = ({ pageId }) => {
    return (
        <>
            <Card style={{color:'black', padding:'20px', margin:'10px', maxWidth:'100%', width:'100%'}}>
                <h1>백준 1001. A + B</h1>
                <h2>시간 : 44ms</h2>
                <h2>메모리 : 25646 MB</h2>
                <h3>날짜 : 2024. 07. 99</h3>
                <h3>언어 : <FaPython /> Python</h3>

                <Card style={{backgroundColor:'black',border:'1px solid white', borderRadius:'10px', margin:'10px', padding:'10px', color:'white'}}>
                    <p>풀이 1</p>
                    <code>
                        a = int(input())
                        <br />
                        b = int(input())
                        <br />
                        print(a + b)
                    </code>
                </Card>

                <Card style={{backgroundColor:'black',border:'1px solid white', borderRadius:'10px', margin:'10px', padding:'10px', color:'white'}}>
                    <p>풀이 2</p>
                    <code>
                        print(int(input()) + int(input()))
                    </code>
                </Card>
                
            </Card>
        </>
    );
};

export default CodePageTemplates;
