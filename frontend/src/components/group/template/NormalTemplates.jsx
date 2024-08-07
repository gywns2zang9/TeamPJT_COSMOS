import React, { useEffect, useRef, useState } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import axios from 'axios';
import useGroupStore from '../../../store/group.js';

const NormalTemplates = ({ pageId, groupId }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const updateFile = useGroupStore((state) => state.updateNormalFile)
    const loadFile = useGroupStore((state) => state.getFile)
    const [title, setTitle] = useState('');

    useEffect(() => {
        const simpleMDE = new SimpleMDE({
            element: editorRef.current,
            autoDownloadFontAwesome: false,
            spellChecker: false,
            status: false,
            toolbar: false, 
        });
        setEditor(simpleMDE);

        // TODO - 페이지 로딩 시 내용 가져오기
        const getFile = async () => {
            try {
                const response = await loadFile({ groupId, fileId:pageId })
                console.log(response);
                simpleMDE.value(response.content || '');
            } catch (err) {
                console.error('페이지 로딩 실패 -> ', err);
            }
        }
        
        const editFile = async (content) => {
            try {
                const response = await updateFile({ groupId, fileId:pageId, name:title, content })
                console.log(response);
            } catch (err) {
                console.error('페이지  실패 -> ', err);
            }
        }

        // TODO - 내용 변경 시 자동 저장
        simpleMDE.codemirror.on('change', () => {
            const newContent = simpleMDE.value();
            editFile(newContent);
            axios.post(`/api/pages/${pageId}`, { content: newContent })
                .then(response => console.log('Saved'))
                .catch(error => console.error('Save error', error));
        });

        // 단축키 설정
        const editorInstance = simpleMDE.codemirror;
        editorInstance.setOption('extraKeys', {
            'Ctrl-B': () => {
                const doc = editorInstance.getDoc();
                const sel = doc.getSelection();
                if (sel) {
                    doc.replaceSelection(`**${sel}**`);
                }
            },
            'Ctrl-I': () => {
                const doc = editorInstance.getDoc();
                const sel = doc.getSelection();
                if (sel) {
                    doc.replaceSelection(`*${sel}*`);
                }
            },
            'Ctrl-U': () => {
                const doc = editorInstance.getDoc();
                const sel = doc.getSelection();
                if (sel) {
                    doc.replaceSelection(`<u>${sel}</u>`);
                }
            },
            'Ctrl-Shift-X': () => {
                const doc = editorInstance.getDoc();
                const sel = doc.getSelection();
                if (sel) {
                    doc.replaceSelection(`~~${sel}~~`);
                }
            },
        });

        getFile();
        return () => {
            simpleMDE.toTextArea();
        };
    }, [pageId]);

    return (
        <div style={{ height: '100vh', margin: '0',padding: '10px', overflow: 'auto' }}>
            <textarea ref={editorRef} />
        </div>
    );
};

export default NormalTemplates;
