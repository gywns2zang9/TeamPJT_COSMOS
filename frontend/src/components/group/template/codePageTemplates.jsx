import React, { useEffect, useState, useRef } from 'react'; // useRef 추가
import { Button, Card, CardText } from 'react-bootstrap';
import useGroupStore from '../../../store/group';

import { setupYjsDoc } from '../../../utils/yjs-websocket2.js';
import * as Y from 'yjs';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodePageTemplates = ({ groupId, pageId }) => {
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('');
    const [problemInfo, setProblemInfo] = useState({});
    const [codeContent, setCodeContent] = useState('');
    const [date, setDate] = useState('');
    const getFile = useGroupStore((state) => state.getFile);
    const saveFile = useGroupStore((state) => state.updateCodeFile);
    const [compileNumbers, setCompileNumbers] = useState(1);
    const [inputsOutputs, setInputsOutputs] = useState([{ input: '', output: '', isLoading: false }]);
    const executeCode = useGroupStore((state) => state.executeCode);
    const [, setForceRender] = useState(false);

    const { ydoc, wsProvider, yText } = setupYjsDoc(pageId); // Yjs 문서 설정
    const saveTimeoutRef = useRef(null); // saveTimeoutRef 추가
    
    // 코드 실행
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

    // 코드 저장
    const updateFile = async ({ groupId, fileId, name, code, content, language }) => {
        try {
            const response = await saveFile({ groupId, fileId: pageId, name, code, content, language });
            console.log(response);
        } catch (err) {
            console.log('저장 실패 -> ', err);
        }
    };

    useEffect(() => {
        loadFile();

        // Yjs 업데이트 이벤트 처리
        yText.observe(event => {
            setCodeContent(yText.toString());
            triggerSave(); // 입력 후 1초 뒤 저장 실행
        });

        return () => {
            wsProvider.disconnect();
        };
    }, [groupId, pageId]);

    const loadFile = async () => {
        try {
            const response = await getFile({ groupId, fileId: pageId });
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
                yText.delete(0, yText.length); // 기존 Yjs 문서 내용을 초기화
                yText.insert(0, response.code.content); // 불러온 코드를 Yjs 문서에 삽입
            }
        } catch (err) {
            console.error('코드불러오기 실패 -> ', err);
        }
    };

    // 사용자의 입력이 멈추고 1초 뒤에 코드 저장을 실행
    const triggerSave = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            updateFile({
                groupId,
                fileId: pageId,
                name: fileName,
                code: codeContent,
                content,
                language
            });
        }, 1000);
    };

    // textarea의 입력을 처리하는 함수
    const handleCodeChange = (e) => {
        yText.delete(0, yText.length); // 기존 내용을 삭제
        yText.insert(0, e.target.value); // 새 텍스트 삽입
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

    return (
        <>
            <Card style={{ backgroundColor:'inherit', color: 'white', padding: '20px', margin: '10px', maxWidth: '100%', width: '100%' }}>
                <h3>
                    <a 
                        href={`https://www.acmicpc.net/problem/${problemInfo.number}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        {problemInfo.site} {problemInfo.number}. {problemInfo.name}
                    </a>
                </h3>
                <h4>저장한 날짜 : {date}</h4>
                <h4>언어 : {language}</h4>

                <Card style={{ backgroundColor: 'black', border: '1px solid white', borderRadius: '10px', margin: '10px', padding: '10px', color: 'white' }}>
                    <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                        <p>{fileName}</p>
                        <p>{language.toLowerCase()}</p>
                    </div>
                    <textarea 
                        value={codeContent} 
                        onChange={handleCodeChange} // onChange 핸들러 추가
                        style={{ width: '100%', height: '300px', backgroundColor:'inherit' }} // 스타일 추가
                    />
                    <CardText>
                        <Button onClick={addInputOutput}>입력 추가하기</Button>
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
                                            style={{ width: '100%', height: '100px', backgroundColor:'inherit' }}
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
                                    <Button variant="danger" onClick={() => handleRemoveInputOutput(index)} style={{ marginLeft: '10px' }}>
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
