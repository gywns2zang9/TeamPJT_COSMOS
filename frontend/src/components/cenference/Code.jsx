import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import "../../css/conference/conference.css";

const Code = ({ toggleVideo, isOpen }) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [binding, setBinding] = useState(null);

  useEffect(() => {
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      "monaco-react-2",
      ydoc
    );
    setProvider(provider);
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc]);

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
          <button className="button">백준</button>
          <button className="button">프로그래머스</button>
          <button className="button">SWEA</button>
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
          // defaultValue="// some comment"
          defaultLanguage="java"
          onMount={(editor) => {
            setEditor(editor);
          }}
        />
      </div>
      <div className="code-lower-space">
        <button className="button">코드 공유하기</button>
        <button className="button">코드 저장하기</button>
        <button className="button">내 코드 보기</button>
        <button className="button">공유 코드 보기</button>
      </div>
    </div>
  );
};

export default Code;
