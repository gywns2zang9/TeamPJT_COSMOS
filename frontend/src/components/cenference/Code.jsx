import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import "../../css/conference/conference.css";

const Code = ({ toggleVideo, isOpen, groupId }) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [binding, setBinding] = useState(null);
  const [language, setLanguage] = useState("java");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      groupId,
      // "monaco-react-2",
      ydoc
    );
    setProvider(provider);
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc, groupId]);

  useEffect(() => {
    if (provider == null || editor == null) {
      return;
    }
    const binding = new MonacoBinding(
      ydoc.getText(),
      editor.getModel(),
      new Set([editor]),
      provider.awareness
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
      <div></div>
      <div className="code-lower-space">
        <div className="code-buttons">
          <button className="button">내 코드 공유</button>
          <button className="button">코드 저장</button>
          <button className="button">코드 보기</button>
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
