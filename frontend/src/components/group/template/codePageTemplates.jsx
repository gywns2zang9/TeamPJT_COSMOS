// import React, { useEffect, useState } from 'react';
// import { Button, Card, CardText } from 'react-bootstrap';
// import useGroupStore from '../../../store/group';

// import { setupYjsDoc } from '../../../utils/yjs-websocket2.js';
// import * as Y from 'yjs';

// const CodePageTemplates = ({ groupId, pageId }) => {
//     const [fileName, setFileName] = useState('');
//     const [content, setContent] = useState('');
//     const [language, setLanguage] = useState('');
//     const [problemInfo, setProblemInfo] = useState({});
//     const [codeContent, setCodeContent] = useState('');
//     const [date, setDate] = useState('');
//     const getFile = useGroupStore((state) => state.getFile);
//     const saveFile = useGroupStore((state) => state.updateCodeFile)
//     const [compileNumbers, setCompileNumbers] = useState(1);
//     const [inputsOutputs, setInputsOutputs] = useState([{ input: '', output: '', isLoading: false }]);
//     const executeCode = useGroupStore((state) => state.executeCode);
//     const [, setForceRender] = useState(false); 
    
//     // 코드 실행
//     const runCode = async (index) => {
//         const updatedInputsOutputs = [...inputsOutputs];
//         updatedInputsOutputs[index].isLoading = true;
//         setInputsOutputs(updatedInputsOutputs);

//         try {
//             const codeForSend = codeContent.toString();
//             const response = await executeCode({ content: codeForSend, language, input: inputsOutputs[index].input });
//             updatedInputsOutputs[index].output = response.results;
//         } catch (err) {
//             console.error('코드실행실패 -> ', err);
//             updatedInputsOutputs[index].output = '코드 실행에 실패했습니다.';
//         } finally {
//             updatedInputsOutputs[index].isLoading = false;
//             setInputsOutputs(updatedInputsOutputs);
//             setForceRender(prev => !prev);  
//         }
//     };

//     // 코드 저장
//     const updateFile = async ({ groupId, fileId, name, code, content, language }) => {
//         try {
//             const response = await saveFile({ groupId, fileId:pageId, name, code, content, language })
//             console.log(response);
//         } catch (err) {
//             console.log('저장 실패 -> ', err);
//         }
//     }
//     useEffect(() => {
//         loadFile();
//     }, [groupId, pageId]);

//     const loadFile = async () => {
//         try {
//             const response = await getFile({ groupId, fileId: pageId });
//             setProblemInfo({
//                 number: response.problems[0].number,
//                 name: response.problems[0].name,
//                 site: response.problems[0].site,
//             });
//             setFileName(response.fileName);
//             setContent(response.content);
//             if (response.code) {
//                 setCodeContent(response.code.content);
//                 setDate(new Date(response.code.createdAt).toISOString().split('T')[0]);
//                 setLanguage(response.code.language);
//             }
//         } catch (err) {
//             console.error('코드불러오기 실패 -> ', err);
//         }
//     };

//     const handleInputChange = (index, value) => {
//         const updatedInputsOutputs = [...inputsOutputs];
//         updatedInputsOutputs[index].input = value;
//         setInputsOutputs(updatedInputsOutputs);
//     };

//     const handleRemoveInputOutput = (index) => {
//         if (index === 0) return;
//         const updatedInputsOutputs = inputsOutputs.filter((_, idx) => idx !== index);
//         setInputsOutputs(updatedInputsOutputs);
//         setCompileNumbers(compileNumbers - 1);
//     };

//     const addInputOutput = () => {
//         setInputsOutputs([...inputsOutputs, { input: '', output: '', isLoading: false }]);
//         setCompileNumbers(compileNumbers + 1);
//     };

//     return (
//         <>
//             <Card style={{ color: 'black', padding: '20px', margin: '10px', maxWidth: '100%', width: '100%' }}>
//                 <h3>
//                     <a 
//                         href={`https://www.acmicpc.net/problem/${problemInfo.number}`} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         style={{ color: 'inherit', textDecoration: 'none' }}
//                     >
//                         {problemInfo.site} {problemInfo.number}. 
//                         {problemInfo.name}
//                     </a>
//                 </h3>
//                 <h4>저장한 날짜 : {date}</h4>
//                 <h4>언어 : {language}</h4>

//                 <Card style={{ backgroundColor: 'black', border: '1px solid white', borderRadius: '10px', margin: '10px', padding: '10px', color: 'white' }}>
//                     <div className='d-flex' style={{ justifyContent: 'space-between' }}>
//                         <p>{fileName}</p>
//                         <p>{language.toLowerCase()}</p>
//                     </div>
//                     <textarea name="" id="" value={codeContent}></textarea>
//                     <CardText>
//                         <Button onClick={addInputOutput}>입력 추가하기</Button>
//                     </CardText>

//                     {inputsOutputs.map((io, index) => (
//                         <React.Fragment key={index}>
//                             <div className='d-flex' style={{ justifyContent: 'space-around', marginBottom: '10px' }}>
//                                 <div style={{ width: '45%' }}>
//                                     <CardText>Input {index + 1}</CardText>
//                                     <CardText>
//                                         <textarea
//                                             value={io.input}
//                                             onChange={(e) => handleInputChange(index, e.target.value)}
//                                             style={{ width: '100%', height: '100px' }}
//                                         />
//                                     </CardText>
//                                 </div>
//                                 <div style={{ width: '45%' }}>
//                                     <CardText>Output {index + 1}</CardText>
//                                     <CardText>
//                                         <pre
//                                             style={{ width: '100%', height: '100px', whiteSpace: 'pre-wrap', overflowY: 'auto' }}
//                                         >
//                                             {io.output || ''}
//                                         </pre>
//                                     </CardText>
//                                 </div>
//                             </div>
//                             <div>
//                                 <Button
//                                     onClick={() => runCode(index)}
//                                     disabled={io.isLoading}
//                                 >
//                                     {io.isLoading ? (
//                                         <>
//                                             <i className="fas fa-spinner fa-spin" style={{ marginRight: '5px' }}></i>
//                                             실행중...
//                                         </>
//                                     ) : (
//                                         '코드 실행'
//                                     )}
//                                 </Button>
//                                 {index !== 0 && (
//                                     <Button variant="danger" onClick={() => handleRemoveInputOutput(index)} style={{ marginLeft: '10px' }}>
//                                         삭제
//                                     </Button>
//                                 )}
//                             </div>
//                         </React.Fragment>
//                     ))}
//                 </Card>
//             </Card>
//         </>
//     );
// };

// export default CodePageTemplates;


import React, { useEffect, useState, useCallback } from 'react';
import { Button, Card, CardText } from 'react-bootstrap';
import useGroupStore from '../../../store/group';
import { setupYjsDoc } from '../../../utils/yjs-websocket.js';
import * as Y from 'yjs';

const CodePageTemplates = ({ groupId, pageId }) => {
    const [fileName, setFileName] = useState('');
    const [language, setLanguage] = useState('');
    const [problemInfo, setProblemInfo] = useState({});
    const [date, setDate] = useState('');
    const [codeContent, setCodeContent] = useState('');
    const [inputsOutputs, setInputsOutputs] = useState([{ input: '', output: '', isLoading: false }]);
    const getFile = useGroupStore((state) => state.getFile);
    const saveFile = useGroupStore((state) => state.updateCodeFile);
    const executeCode = useGroupStore((state) => state.executeCode);
    const [, setForceRender] = useState(false);

    // Yjs variables
    const [yText, setYText] = useState(null);
    
    // Initialize Yjs document and WebSocket
    useEffect(() => {
        const { ydoc, wsProvider, yText } = setupYjsDoc(groupId);
        setYText(yText);

        // Handle cleanup on component unmount
        return () => {
            wsProvider.destroy();
        };
    }, [groupId]);

    // Update local codeContent when Yjs document changes
    useEffect(() => {
        if (yText) {
            const updateCodeContent = () => {
                setCodeContent(yText.toString());
            };

            // Listen to changes in Y.Text
            yText.observe(updateCodeContent);

            // Cleanup listener on component unmount
            return () => {
                yText.unobserve(updateCodeContent);
            };
        }
    }, [yText]);

    // Update Yjs document when codeContent changes
    const handleCodeContentChange = useCallback((event) => {
        const newValue = event.target.value;
        setCodeContent(newValue);

        if (yText) {
            yText.delete(0, yText.length); // Clear existing content
            yText.insert(0, newValue); // Insert new content
        }
    }, [yText]);

    // Code execution logic
    const runCode = async (index) => {
        const updatedInputsOutputs = [...inputsOutputs];
        updatedInputsOutputs[index].isLoading = true;
        setInputsOutputs(updatedInputsOutputs);

        try {
            const codeForSend = codeContent.toString();
            const response = await executeCode({ content: codeForSend, language, input: inputsOutputs[index].input });
            updatedInputsOutputs[index].output = response.results;
        } catch (err) {
            console.error('코드 실행 실패 -> ', err);
            updatedInputsOutputs[index].output = '코드 실행에 실패했습니다.';
        } finally {
            updatedInputsOutputs[index].isLoading = false;
            setInputsOutputs(updatedInputsOutputs);
            setForceRender(prev => !prev);
        }
    };

    // 코드 저장하기
    const updateFile = async ({ groupId, fileId, name, code, content, language }) => {
        try {
            
            console.log('성공');
            const response = await saveFile({ groupId, fileId, name, code, content, language });
            console.log(response);
        } catch (err) {
            console.log('저장 실패 -> ', err);
        }
    };

    useEffect(() => {
        const updateFileContent = async () => {
            if (yText) {
                const updatedContent = yText.toString();
                await updateFile({
                    groupId,
                    fileId: pageId,
                    name: fileName,
                    code: updatedContent,
                    content: updatedContent,
                    language
                });
            }
        };
    
        const intervalId = setInterval(updateFileContent, 2000);
        return () => {
            clearInterval(intervalId);
        };
    }, [groupId, pageId, fileName, language, yText]);
    
    useEffect(() => {
        loadFile();
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
            setDate(new Date(response.code.createdAt).toISOString().split('T')[0]);
            setLanguage(response.code.language);
            if (response.code) {
                setCodeContent(response.code.content);
            }
        } catch (err) {
            console.error('코드 불러오기 실패 -> ', err);
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
    };

    const addInputOutput = () => {
        setInputsOutputs([...inputsOutputs, { input: '', output: '', isLoading: false }]);
    };

    return (
        <>
            <Card style={{ color: 'black', padding: '20px', margin: '10px', maxWidth: '100%', width: '100%' }}>
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
                        onChange={handleCodeContentChange}
                        style={{ width: '100%', height: '300px' }}
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
                                            style={{ width: '100%', height: '100px' }}
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
