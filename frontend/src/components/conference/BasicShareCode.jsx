// 커서가 없는 베이직 yjs코드
import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";

const ShareCode = ({ groupId, language }) => {
  // Yjs 문서 인스턴스를 생성
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [binding, setBinding] = useState(null);

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
      // ydoc.getText().delete(0, ydoc.getText().length);
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
    <Editor
      height="90%"
      language={language}
      onMount={(editor) => {
        setEditor(editor);
      }}
    />
  );
};

export default ShareCode;
