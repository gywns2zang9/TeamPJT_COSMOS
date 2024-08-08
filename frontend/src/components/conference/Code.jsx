import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ShareCode from "./ShareCode"; // ShareCode 컴포넌트 import
import axios from "axios";
import "../../css/conference/code.css";

const Code = ({ toggleVideo, isOpen, groupId }) => {
  const [language, setLanguage] = useState("java");
  const [isShared, setIsShared] = useState(false);
  const [personalCode, setPersonalCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showIO, setShowIO] = useState(false);

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

  const toggleCompiler = () => {
    setShowIO(!showIO); // 입력 및 출력 영역 표시
  };

  const handleExecute = async () => {
    try {
      const response = await axios.get(`/teams/${groupId}/codes/execute`, {
        content: personalCode,
        language: language,
        inputs: input,
      });

      const results = response.data;
      const resultString = results.map((res) => res.result).join("\n");
      setOutput(resultString);
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput("Error compiling code");
    }
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
            {/* <option value="cpp">C++</option> */}
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
            // theme="vs-dark"
            language={language}
            value={personalCode}
            onChange={handleEditorChange}
          />
        )}
      </div>
      {
        !isShared ? (
          <div>
            {showIO && (
              <div className="input-output">
                <textarea
                  name="input"
                  id="input"
                  placeholder="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>
                <textarea
                  name="output"
                  id="output"
                  placeholder="output"
                  value={output}
                  readOnly
                ></textarea>
              </div>
            )}
            <div className="code-lower-space">
              <div className="code-buttons">
                <button className="button">코드 불러오기</button>
                <button className="button">코드 저장</button>
              </div>
              <div className="compile-button">
                <button className="button" onClick={toggleCompiler}>
                  {showIO ? "컴파일러 닫기" : "컴파일러"}
                </button>
                {showIO && (
                  <button className="button" onClick={handleExecute}>
                    실행
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null
        // <div className="code-lower-space"></div>
      }
    </div>
  );
};

export default Code;
