import React, { useEffect, useRef, useState } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import useGroupStore from '../../../store/group.js';
import { Card, Button } from 'react-bootstrap';
// yjs
import { setupYjsDoc } from '../../../utils/yjs-websocket.js';
import * as Y from 'yjs';

const NormalTemplates = ({ pageId, groupId }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const updateFile = useGroupStore((state) => state.updateNormalFile);
    const loadFile = useGroupStore((state) => state.getFile);
    const [title, setTitle] = useState('');
    const yTextRef = useRef(null);
    const lastSavedContentRef = useRef(false);
    // 플래그를 사용하여 무한 루프 방지
    const isLocalChangeRef = useRef(false);

    useEffect(() => {
        const simpleMDE = new SimpleMDE({
            element: editorRef.current,
            autoDownloadFontAwesome: false,
            spellChecker: false,
            status: false,
            toolbar: false,
        });
        setEditor(simpleMDE);
        simpleMDE.codemirror.setOption('lineNumbers', true);

        const { ydoc } = setupYjsDoc(`${groupId}-${pageId}`);
        const yText = ydoc.getText('codemirror');
        yTextRef.current = yText;

        return () => {
            if (simpleMDE) {
                simpleMDE.toTextArea();
            }
        };
    }, [pageId, groupId]);

    // 페이지 수정 저장 API 호출
    const editFile = async (content) => {
        try {
            const response = await updateFile({ groupId, fileId:pageId, name:title, content})
            console.log(response);
        } catch (err) {
            console.log('수정 실패 -> ', err);
        }
    }

    useEffect(() => {
        if (editor && yTextRef.current) {
            const yText = yTextRef.current;

            yText.observe(event => {
                if (isLocalChangeRef.current) {
                    return;  // 로컬 변경이므로 무시
                }

                const newText = yText.toString();
                const doc = editor.codemirror.getDoc();
                const cursor = doc.getCursor();

                if (editor.value() !== newText) {
                    const scrollPosition = editor.codemirror.getScrollInfo();
                    editor.value(newText);

                    // 커서 위치 복원
                    doc.setCursor(cursor);
                    editor.codemirror.scrollTo(scrollPosition.left, scrollPosition.top);
                }
            });

            editor.codemirror.on('change', () => {
                if (!isLocalChangeRef.current) {
                    const newText = editor.value();

                    if (yText.toString() !== newText) {
                        isLocalChangeRef.current = true;
                        yText.delete(0, yText.length);
                        yText.insert(0, newText);
                        isLocalChangeRef.current = false;
                    }
                }
            });
        }
    }, [editor]);

    useEffect(() => {
        const getFile = async () => {
            try {
                const response = await loadFile({ groupId, fileId: pageId });
                if (editor) {
                    editor.value(response.content || '');
                }
                setTitle(response.fileName);
            } catch (err) {
                console.error('페이지 로딩 실패 -> ', err);
            }
        };

        if (editor) {
            getFile();
        }
    }, [pageId, groupId, loadFile, editor]);

    const updateTitle = async () => {
        try {
            const content = editor?.value() || '';
            const response = await updateFile({ groupId, fileId: pageId, name: title, content });
            console.log(response);
            window.location.reload();
        } catch (err) {
            console.error('제목 변경 실패 -> ', err);
        }
    };

    // 2초마다 저장
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentContent = yTextRef.current?.toString();
            if (currentContent && currentContent !== lastSavedContentRef.current) {
                editFile(currentContent, title);
            }
        }, 2000);

        return () => clearInterval(intervalId); 
    }, [title]);
    
    // 스타일 적용
    useEffect(() => {
        const codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            codeMirrorElement.style.background = 'inherit';
            codeMirrorElement.style.border = '1px solid white';
            codeMirrorElement.style.color = 'white';
        }
        const lineNumbersElement = document.querySelectorAll('.CodeMirror-gutters');
        lineNumbersElement.forEach((element) => {
            element.style.background = 'inherit';
            element.style.color = '#2F95DC';
        });
    }, [editor]);

    return (
        <>
            <div>
                <Card style={{ backgroundColor:'inherit'}}>
                    <Card.Header style={{ backgroundColor:'inherit'}}>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            style={{ backgroundColor:'inherit', width:'70%', marginRight:'10px' }}
                        />
                        <Button onClick={updateTitle}>제목 변경</Button>
                    </Card.Header>
                </Card>
            </div>
            <div style={{ height: '100vh', margin: '0', padding: '10px', overflow: 'auto', backgroundColor:'inherit', color:'white'}}>
                <textarea ref={editorRef} />
            </div>
        </>
    );
};

export default NormalTemplates;
