import React, { useState, useEffect, useRef } from 'react';

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

    // 줄바꿈 시 스크롤을 맨 아래로 자동으로 이동
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [value]);

    return (
        <div style={{ display: 'flex', position: 'relative', height: '400px' }}>
            <div 
                ref={lineNumbersRef}
                className="line-numbers"
                style={{
                    border: '1px solid white',
                    borderRadius: '5px',
                    padding: '5px',
                    backgroundColor: '#333',
                    color: '#aaa',
                    textAlign: 'right',
                    userSelect: 'none',
                    borderRight: '1px solid #444',
                    whiteSpace: 'pre-wrap',
                    minWidth: '50px',
                    maxWidth:'50px',
                    boxSizing: 'border-box',
                    height: '100%',
                    overflowY: 'hidden', // 스크롤바 숨기기
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    
                }}
            >
                {lineNumbers}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onScroll={syncScroll} // 스크롤 이벤트를 syncScroll 함수에 연결
                style={{
                    flex: 1,
                    
                    display:'inline-block',
                    padding: '5px',
                    marginLeft:'50px',
                    fontFamily: 'monospace',
                    border: '1px solid #ddd',
                    backgroundColor: '#1e1e1e',
                    color: '#dcdcdc',
                    borderLeft: 'none',
                    outline: 'none',
                    height: '100%',
                    overflowY: 'auto', // 내부 스크롤 가능
                    resize: 'none', // 사용자가 크기 조절하지 못하게 설정
                    
                }}
            />
        </div>
    );
};

export default CodeWithLineNumbers;
