import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import "../../css/conference/code.css";

const Code = ({ toggleVideo, isOpen, groupId }) => {
  // Yjs 문서 인스턴스를 생성
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [binding, setBinding] = useState(null);
  const [language, setLanguage] = useState("java");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    // WebsocketProvider를 생성하여 Yjs 문서와 연결
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws", // Yjs WebSocket 서버 URL
      groupId, // 그룹 ID
      ydoc // Yjs 문서 인스턴스
    );
    setProvider(provider);

    return () => {
      // 컴포넌트 언마운트 시 Yjs 문서 내용을 삭제
      ydoc.getText().delete(0, ydoc.getText().length);
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc, groupId]);

  useEffect(() => {
    if (provider == null || editor == null) {
      return;
    }

    // MonacoBinding을 생성하여 Yjs 문서와 Monaco Editor를 연결
    const binding = new MonacoBinding(
      ydoc.getText(), // Yjs 문서의 텍스트 데이터
      editor.getModel(), // Monaco Editor의 모델
      new Set([editor]), // 에디터 인스턴스 Set으로 감싸기
      provider.awareness // 사용자 커서 등의 상태를 동기화하는 Awareness 인스턴스
    );
    setBinding(binding);
    return () => {
      binding.destroy();
    };
  }, [ydoc, provider, editor]);

  return (
    <div className="left-space">
      <div className="code-upper-space">
        <div>
          <button className="button">내 코드 불러오기</button>
          <select className="code-select" onChange={handleLanguageChange}>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div>
          <button className="button" onClick={toggleVideo}>
            {isOpen ? "⇑" : "⇓"}
          </button>
        </div>
      </div>
      <div className="code-space">
        <Editor
          // height="100%"
          value="abcde"
          language={language}
          onMount={(editor) => {
            setEditor(editor);
          }}
        />
      </div>
      <div className="code-lower-space">
        <div className="code-buttons">
          <button className="button">내 코드 공유</button>
          <button className="button">코드 저장</button>
          <button className="button">내 코드 보기</button>
          <button className="button">공유 코드 보기</button>
        </div>
        <div className="compile-button">
          <button className="button">컴파일</button>
        </div>
      </div>
    </div>
  );
};

export default Code;
