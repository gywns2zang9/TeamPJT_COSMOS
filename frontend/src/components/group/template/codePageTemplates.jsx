import React, { useEffect, useState } from 'react';
import { Button, Card, CardText } from 'react-bootstrap';
import { Light  } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useGroupStore from '../../../store/group';

import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';

const CodePageTemplates = ({ groupId, pageId }) => {
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('');
    const [problemInfo, setProblemInfo] = useState({});
    const [codeContent, setCodeContent] = useState('');
    const [date, setDate] = useState('');
    const getFile = useGroupStore((state) => state.getFile);

    // 코드 컴파일
    const [compileNumbers, setCompileNumbers] = useState(1);
    const [showTextarea, setShowTextarea] = useState(false);
    const [input, setInput] = useState([]);
    const [output, setOutput] = useState([]);
    const executeCode = useGroupStore((state) => state.executeCode)
    const runCode = async () => {
        try {
            const codeForSend = codeContent.toString()
            console.log(typeof(codeForSend));
            const response = await executeCode({ content:codeForSend, language, input });
            console.log(response.results);
            setOutput(response.results);
        } catch (err) {
            console.error('코드실행실패 -> ', err);
        }
    }
    const handleRunCode = () => {
        runCode()
    }


    // 사용할 언어 등록
    Light.registerLanguage('python', python);
    Light.registerLanguage('java', java);

    const loadFile = async () => {
        try {
            const response = await getFile({ groupId, fileId: pageId });
            console.log(response.problems[0].number);
            console.log(response.problems[0].name);
            console.log(response.problems[0].site);
            setProblemInfo({
                number: response.problems[0].number,
                name: response.problems[0].name,
                site: response.problems[0].site,
            })
            setFileName(response.fileName);
            setContent(response.content);
            if (response.code) {
                setCodeContent(response.code.content);
                setDate(new Date(response.code.createdAt).toISOString().split('T')[0]);
                setLanguage(response.code.language);
            }
        } catch (err) {
            console.error('코드불러오기 실패 -> ', err);
        }
    };

    useEffect(() => {
        setInput(['']);
        setOutput(['']);
        loadFile();
    }, [groupId, pageId]);

    const handleInputChange = (index, value) => {
        const newInputs = [...input];
        newInputs[index] = value;
        setInput(newInputs);
    };

    const handleOutputChange = (index, value) => {
        const newOutputs = [...output];
        newOutputs[index] = value;
        setOutput(newOutputs);
    };

    const addInputOutput = () => {
        setCompileNumbers(compileNumbers + 1);
        setInput([...input, '']);
        setOutput([...output, '']);
    };

    const handleRemoveInputOutput = (index) => {
        if (index > 0) {
            const newInputs = input.filter((_, i) => i !== index);
            const newOutputs = output.filter((_, i) => i !== index);
            setInput(newInputs);
            setOutput(newOutputs);
            setCompileNumbers(compileNumbers - 1);
        }
    };

    return (
        <>
            <Card style={{ color: 'black', padding: '20px', margin: '10px', maxWidth: '100%', width: '100%' }}>
                <h3>{problemInfo.site} {problemInfo.number}. {problemInfo.name}</h3>
                <h4>저장한 날짜 : {date}</h4>
                <h4>언어 : {language}</h4>

                <Card style={{ backgroundColor: 'black', border: '1px solid white', borderRadius: '10px', margin: '10px', padding: '10px', color: 'white' }}>
                    <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                        <p>{fileName}</p>
                        <p>{language.toLowerCase()}</p>
                    </div>
                    <Light language={language} style={docco}>
                        {codeContent}
                    </Light>
                    <CardText>
                        <Button onClick={() => setShowTextarea(!showTextarea)}>
                            {showTextarea ? '접기' : '펼쳐서 실행하기'}
                        </Button>
                    </CardText>
                    {showTextarea && (
                        <>
                            {Array.from({ length: compileNumbers }).map((_, index) => (
                                <div className='d-flex' style={{ justifyContent: 'space-around', marginBottom: '10px' }} key={index}>
                                    <div style={{ width: '45%' }}>
                                        <CardText>input</CardText>
                                        <CardText>
                                            <textarea
                                                value={input[index]}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                style={{ width: '100%', height: '100px' }}
                                            />
                                        </CardText>
                                    </div>
                                    <div style={{ width: '45%' }}>
                                        <CardText>output</CardText>
                                        <CardText>
                                            <pre
                                                style={{ width: '100%', height: '100px', whiteSpace: 'pre-wrap', overflowY: 'auto' }}
                                            >
                                                {output[index] || ''}
                                            </pre>
                                        </CardText>
                                    </div>
                                    {index > 0 && (
                                        <Button onClick={() => handleRemoveInputOutput(index)} style={{ height: '40px', alignSelf: 'center' }}>
                                            삭제
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button onClick={addInputOutput}>입력 추가하기</Button>
                            <div>
                                <Button onClick={handleRunCode}>코드 실행</Button>
                            </div>
                        </>
                    )}
                </Card>
            </Card>
        </>
    );
};

export default CodePageTemplates;