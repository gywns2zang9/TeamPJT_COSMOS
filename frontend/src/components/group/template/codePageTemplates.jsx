import React, { useEffect, useState } from 'react';
import { Button, Card, CardText } from 'react-bootstrap';
import { Light } from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
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
    const [editMode, setEditMode] = useState(false);
    const getFile = useGroupStore((state) => state.getFile);

    const [compileNumbers, setCompileNumbers] = useState(1);
    const [inputsOutputs, setInputsOutputs] = useState([{ input: '', output: '', isLoading: false }]);
    const executeCode = useGroupStore((state) => state.executeCode);
    const [, setForceRender] = useState(false); 
    const updateCodeFile = useGroupStore((state) => state.updateCodeFile);

    const runCode = async (index) => {
        const updatedInputsOutputs = [...inputsOutputs];
        updatedInputsOutputs[index].isLoading = true;
        setInputsOutputs(updatedInputsOutputs);

        try {
            const codeForSend = codeContent.toString();
            const response = await executeCode({ content: codeForSend, language, input: inputsOutputs[index].input });
            updatedInputsOutputs[index].output = response.results;
        } catch (err) {
            console.error('코드실행실패 -> ', err);
            updatedInputsOutputs[index].output = '코드 실행에 실패했습니다.';
        } finally {
            updatedInputsOutputs[index].isLoading = false;
            setInputsOutputs(updatedInputsOutputs);
            setForceRender(prev => !prev);  
        }
    };

    useEffect(() => {
        loadFile();
    }, [groupId, pageId]);

    const loadFile = async () => {
        try {
            const response = await getFile({ groupId, fileId: pageId });
            console.log(response);
            setProblemInfo({
                number: response.problems[0].number,
                name: response.problems[0].name,
                site: response.problems[0].site,
            });
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

    const handleInputChange = (index, value) => {
        const updatedInputsOutputs = [...inputsOutputs];
        updatedInputsOutputs[index].input = value;
        setInputsOutputs(updatedInputsOutputs);
    };

    const handleRemoveInputOutput = (index) => {
        if (index === 0) return;
        const updatedInputsOutputs = inputsOutputs.filter((_, idx) => idx !== index);
        setInputsOutputs(updatedInputsOutputs);
        setCompileNumbers(compileNumbers - 1);
    };

    const addInputOutput = () => {
        setInputsOutputs([...inputsOutputs, { input: '', output: '', isLoading: false }]);
        setCompileNumbers(compileNumbers + 1);
    };

    const handleCodeContentChange = (e) => {
        setCodeContent(e.target.value);
    };

    const saveCodeContent = async () => {
        try {
            await updateCodeFile({ groupId, pageId, name:fileName, code:codeContent, content, language })
            setEditMode(false)
        } catch (err) {
            console.error('코드 저장 실패 -> ', err);
        }
    };

    return (
        <>
            <Card style={{ backgroundColor:'inherit', color: 'white', padding: '20px', margin: '10px', maxWidth: '100%', width: '100%' }}>
                <h3>
                    <a 
                        href={`https://www.acmicpc.net/problem/${problemInfo.number}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                            color: '#63C5DA', 
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        {problemInfo.site} {problemInfo.number}. {problemInfo.name}
                    </a>
                </h3>
                <h5>{date}</h5>
                <h5>언어 : {language}</h5>

                <Card style={{ backgroundColor: 'black', border: '1px solid white', borderRadius: '10px', margin: '10px', padding: '10px', color: 'white' }}>
                    <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                        <p>{fileName}</p>
                        <p>{language.toLowerCase()}</p>
                    </div>
                    {editMode ? (
                        <>
                            <textarea
                                value={codeContent}
                                onChange={handleCodeContentChange}
                                style={{ width: '100%', height: '200px', marginBottom: '10px', backgroundColor:'#e5e5e5', color:'#191919' }}
                            />
                            <Button onClick={saveCodeContent} style={{backgroundColor:'inherit' }}>저장</Button>
                            <Button onClick={() => setEditMode(false)} style={{backgroundColor:'inherit'}}>닫기</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setEditMode(true)} style={{ backgroundColor:'inherit', marginTop: '10px' }}>편집</Button>
                            <Light language={language} style={monokai}>
                                {codeContent}
                            </Light>
                        </>
                    )}
                    <CardText>
                        <Button onClick={addInputOutput} style={{backgroundColor:'inherit'}}>입력 추가하기</Button>
                    </CardText>

                    {inputsOutputs.map((io, index) => (
                        <React.Fragment key={index}>
                            <div className='d-flex' style={{ justifyContent: 'space-around', marginBottom: '10px' }}>
                                <div style={{ width: '45%' }}>
                                    <CardText>Input {index + 1}</CardText>
                                    <CardText>
                                        <textarea
                                            value={io.input}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            style={{ width: '100%', height: '100px', backgroundColor:'inherit', color:'white' }}
                                        />
                                    </CardText>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <CardText>Output {index + 1}</CardText>
                                    <CardText>
                                        <pre
                                            style={{ width: '100%', height: '100px', whiteSpace: 'pre-wrap', overflowY: 'auto' }}
                                        >
                                            {io.output || ''}
                                        </pre>
                                    </CardText>
                                </div>
                            </div>
                            <div>
                                <Button
                                    onClick={() => runCode(index)}
                                    disabled={io.isLoading}
                                    style={{backgroundColor:'inherit'}}
                                >
                                    {io.isLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '5px' }}></i>
                                            실행중...
                                        </>
                                    ) : (
                                        '코드 실행'
                                    )}
                                </Button>
                                {index !== 0 && (
                                    <Button  onClick={() => handleRemoveInputOutput(index)} style={{ backgroundColor:'inherit', marginLeft: '10px' }}>
                                        삭제
                                    </Button>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </Card>
            </Card>
        </>
    );
};

export default CodePageTemplates;
