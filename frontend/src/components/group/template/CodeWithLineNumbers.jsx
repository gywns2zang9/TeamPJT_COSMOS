import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';

const CodeWithLineNumbers = ({ value, language, onChange }) => {
    
    const setLanguage = () => {
        console.log(language);
        if (language === 'JAVA') {
            return java();
        } else if (language === 'PYTHON') {
            return python();
        } else {
            return [];
        }
    }

    const myTheme= createTheme({
        theme: 'dark',
        settings: {
            background: 'black',
            foreground: '#d4d4d4',
            caret: '#ffffff',
            selection: '#264f78',
            selectionMatch: '#264f78',
            lineHighlight: 'black',
            gutterBackground: '#1e1e1e',
            gutterForeground: '#858585',
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
    const maxLength = 1000
    const handleChange = (value) => {
        if (maxLength && value.length > maxLength) {
            alert(`코드는 최대 ${maxLength}자까지 입력할 수 있습니다.`);
            return;
        }
        if (onChange) onChange(value);
    };

    return (
        <div>
            <CodeMirror 
                value={value}
                onChange={handleChange}
                theme={myTheme}
                extensions={[setLanguage(), EditorView.lineWrapping]}
            />
        </div>
    );
};

export default CodeWithLineNumbers;
