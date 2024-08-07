import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ShareCode from "./ShareCode"; // ShareCode 컴포넌트 import
import "../../css/conference/code.css";

const Code = ({ toggleVideo, isOpen, groupId }) => {
  const [language, setLanguage] = useState("java");
  const [isShared, setIsShared] = useState(false);
  const [personalCode, setPersonalCode] = useState("");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const switchToPersonalMode = () => {
    setIsShared(false);
  };

  const switchToSharedMode = () => {
    setIsShared(true);
  };

  useEffect(() => {
    // localStorage에서 개인 코드를 불러옴
    const savedCode = localStorage.getItem("personalCode");
    if (savedCode) {
      setPersonalCode(savedCode);
    }
  }, []);

  const handleEditorChange = (value) => {
    setPersonalCode(value);
    localStorage.setItem("personalCode", value); // 개인 코드를 localStorage에 저장
  };

  return (
    <div className="left-space">
      <div className="code-upper-space">
        <div>
          <button
            className={`mode-button ${!isShared ? "active" : ""}`}
            onClick={switchToPersonalMode}
          >
            내 코드
          </button>
          <button
            className={`mode-button ${isShared ? "active" : ""}`}
            onClick={switchToSharedMode}
          >
            공유 코드
          </button>
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
        {isShared ? (
          <ShareCode groupId={groupId} language={language} />
        ) : (
          <Editor
            height="100%"
            language={language}
            value={personalCode}
            onChange={handleEditorChange}
          />
        )}
      </div>
      {!isShared ? (
        <div>
          <div className="input-output">
            <textarea name="input" id="input" placeholder="input"></textarea>
            <textarea name="output" id="output" placeholder="output"></textarea>
          </div>
          <div className="code-lower-space">
            <div className="code-buttons">
              <button className="button">코드 불러오기</button>
              <button className="button">코드 저장</button>
            </div>
            <div className="compile-button">
              <button className="button">컴파일</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="code-lower-space"></div>
      )}
    </div>
  );
};

export default Code;
