import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import java from '@codemirror/lang-java';
import {python} from '@codemirror/lang-python';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
// 줄 번호가 있는 코드 컴포넌트
const CodeWithLineNumbers = ({ value, onChange }) => {
    const textareaRef = useRef(null);
    const [lineNumbers, setLineNumbers] = useState('');
    const lineNumbersRef = useRef(null);
    // 줄 번호를 업데이트하는 함수
    const updateLineNumbers = () => {
        const lines = textareaRef.current?.value.split('\n').length || 0;
        const numbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
        setLineNumbers(numbers);
    };

    useEffect(() => {
        updateLineNumbers();
    }, [value]);

    // 스크롤 동기화 함수
    const syncScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    // custom theme
    const myTheme= createTheme({
        theme: 'light',
        settings: {
            background: 'black',
            foreground: '#75baff',
            caret: '#5d00ff',
            selection: '#036dd626',
            selectionMatch: '#036dd626',
            lineHighlight: '#8a91991a',
            gutterBackground: '#fff',
            gutterForeground: '#8a919966',
        },
        styles: [
            { tag: t.comment, color: '#6a9955' }, 
            { tag: t.variableName, color: '#9cdcfe' }, 
            { tag: [t.string, t.special(t.brace)], color: '#ce9178' }, 
            { tag: t.number, color: '#b5cea8' }, 
            { tag: t.bool, color: '#569cd6' }, 
            { tag: t.null, color: '#d16969' }, 
            { tag: t.keyword, color: '#c586c0' }, 
            { tag: t.operator, color: '#d4d4d4' }, 
            { tag: t.className, color: '#4ec9b0' }, 
            { tag: t.definition(t.typeName), color: '#4ec9b0' }, 
            { tag: t.typeName, color: '#4ec9b0' }, 
            { tag: t.angleBracket, color: '#569cd6' }, 
            { tag: t.tagName, color: '#569cd6' }, 
            { tag: t.attributeName, color: '#9cdcfe' }, 
        ],
    });

    return (
        <div>
            <CodeMirror 
                value={value}
                onChange={onchange}
                theme={myTheme}
                extensions={[python()]}
            />
        </div>
    );
};

export default CodeWithLineNumbers;
