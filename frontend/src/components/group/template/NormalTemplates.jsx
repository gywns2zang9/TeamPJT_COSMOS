import React, { useEffect, useRef, useState } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import axios from 'axios';

// 페이지 떠날 때, 페이지를 저장하는 API
// 페이지 렌더링 할 때, 페이지를 받는 API

const NormalTemplates = ({ pageId, groupId }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        const simpleMDE = new SimpleMDE({
            element: editorRef.current,
            autoDownloadFontAwesome: false,
            spellChecker: false,
            status: false,
            toolbar: false, 
        });
        setEditor(simpleMDE);

        // 페이지 로딩 시 내용 가져오기
        axios.get(`/api/pages/${pageId}`)
            .then(response => {
                simpleMDE.value(response.data.content || '');
            })
            .catch(error => console.error(error));

        // 내용 변경 시 자동 저장
        simpleMDE.codemirror.on('change', () => {
            const newContent = simpleMDE.value();
            axios.post(`/api/pages/${pageId}`, { content: newContent })
                .then(response => console.log('Saved'))
                .catch(error => console.error('Save error', error));
        });

        // 단축기 설정
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

        // 컴포넌트 언마운트 시 SimpleMDE 인스턴스 정리
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
