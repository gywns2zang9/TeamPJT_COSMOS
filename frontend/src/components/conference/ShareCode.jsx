import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import useAuthStore from "../../store/auth";

// 랜덤 색상 생성 함수
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// 이름이 영어인지 한글인지 확인하는 함수
const isEnglish = (name) => {
  // 모든 문자가 영어 알파벳인 경우 true 반환
  return /^[A-Za-z0-9\s]+$/.test(name);
};

// 이름을 영어와 한글에 맞게 잘라내는 함수
const truncateName = (name) => {
  if (isEnglish(name)) {
    // 영어인 경우, 5글자까지 표시
    return name.length > 5 ? name.slice(0, 5) : name;
  } else {
    // 한글인 경우, 3글자까지 표시
    return name.length > 3 ? name.slice(0, 3) : name;
  }
};

const ShareCode = ({ groupId, language }) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [awarenessStates, setAwarenessStates] = useState([]);
  const [scrollTop, setScrollTop] = useState(0); // 스크롤 위치 저장

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const userInfo = getUserInfo();

  useEffect(() => {
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      groupId,
      ydoc
    );
    setProvider(provider);

    provider.awareness.setLocalStateField("user", {
      name: userInfo.nickName,
      color: getRandomColor(),
    });

    const handleAwarenessUpdate = () => {
      const states = Array.from(provider.awareness.getStates().values());
      setAwarenessStates(states);
    };

    provider.awareness.on("change", handleAwarenessUpdate);

    return () => {
      provider.awareness.off("change", handleAwarenessUpdate);
      provider.destroy();
      ydoc.destroy();
    };
  }, [ydoc, groupId, userInfo.nickName]);

  useEffect(() => {
    if (provider && editor) {
      const binding = new MonacoBinding(
        ydoc.getText(),
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );

      editor.onDidScrollChange(() => {
        const scrollTop = editor.getScrollTop();
        setScrollTop(scrollTop);
      });

      return () => {
        binding.destroy();
      };
    }
  }, [provider, editor, ydoc]);

  useEffect(() => {
    let disposeCursorListener;
    if (editor) {
      const updateCursor = () => {
        const position = editor.getPosition();
        if (position) {
          provider.awareness.setLocalStateField("cursor", {
            line: position.lineNumber,
            column: position.column,
          });
        }
      };

      disposeCursorListener = editor.onDidChangeCursorPosition(updateCursor);
    }
    return () => {
      if (disposeCursorListener) {
        disposeCursorListener.dispose();
      }
    };
  }, [editor, provider]);

  return (
    <div
      className="share-code-space"
      style={{ position: "relative", height: "100%" }}
    >
      <Editor
        height="100%"
        language={language}
        onMount={(editor) => {
          setEditor(editor);
        }}
      />
      {awarenessStates.map((state, index) => {
        if (!state.user || !state.cursor) return null;
        const { name, color } = state.user;
        const { line } = state.cursor;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "4px",
              top: `${line * 18.5 - scrollTop}px`, // 스크롤 위치를 반영하여 닉네임 위치 조정
              backgroundColor: color,
              padding: "0px 4px",
              borderRadius: "4px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              color: "white",
              transform: "translateY(-50%)",
            }}
          >
            {truncateName(name)}
          </div>
        );
      })}
    </div>
  );
};

export default ShareCode;
