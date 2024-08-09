import React, { useEffect, useRef, useState } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import useGroupStore from '../../../store/group.js';
import { Card, Button } from 'react-bootstrap';
// yjs
import { setupYjsDoc } from '../../../utils/yjs-websocket.js'
import * as Y from 'yjs'

const NormalTemplates = ({ pageId, groupId }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const updateFile = useGroupStore((state) => state.updateNormalFile);
    const loadFile = useGroupStore((state) => state.getFile);
    const [title, setTitle] = useState('');
    const yTextRef = useRef(null);

    useEffect(() => {
        const simpleMDE = new SimpleMDE({
            element: editorRef.current,
            autoDownloadFontAwesome: false,
            spellChecker: false,
            status: false,
            toolbar: false,
        });
        setEditor(simpleMDE);
        // yjs 문서 설정
        const { ydoc } = setupYjsDoc(`${groupId}-${pageId}`);
        const yText = ydoc.getText('codemirror')
        yTextRef.current = yText;
        // yjs, simleMDE 동기화
        yText.observe(event => {
            const newText = yText.toString();
            if (editor && editor.value() !== newText) {
                editor.value(newText);
            }
        });

        if (editor) {
            editor.codemirror.on('change', () => {
                yText.delete(0, yText.length);
                yText.insert(0, editor.value());
            });
        }

        return () => {
            if (simpleMDE) {
                simpleMDE.toTextArea();
            }
        };
    }, [pageId, groupId, loadFile, updateFile]
    );

    useEffect(() => {
        const getFile = async () => {
            try {
                const response = await loadFile({ groupId, fileId: pageId });
                console.log(response);
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

    // yjs 쓰면 수정은 어케할까...흠
    // useEffect(() => {
    //     const editFile = async (content) => {
    //         try {
    //             const response = await updateFile({ groupId, fileId: pageId, name: title, content });
    //             console.log(response);
    //         } catch (err) {
    //             console.error('페이지 수정 실패 -> ', err);
    //         }
    //     };

    //     if (editor) {
    //         const handleChange = () => {
    //             const newContent = editor.value();
    //             editFile(newContent);
    //         };

    //         editor.codemirror.on('change', handleChange);

    //         return () => {
    //             editor.codemirror.off('change', handleChange);
    //         };
    //     }
    // }, [editor, pageId, groupId, title, updateFile]);

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

    return (
        <>
            <div>
                <Card>
                    <Card.Header>
                        <p>페이지 제목 : </p>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <Button onClick={updateTitle}>변경</Button>
                    </Card.Header>
                </Card>
            </div>
            <div style={{ height: '100vh', margin: '0', padding: '10px', overflow: 'auto' }}>
                <textarea ref={editorRef} />
            </div>
        </>
    );
};

export default NormalTemplates;
