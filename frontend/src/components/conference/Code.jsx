import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ShareCode from "./ShareCode";
import "../../css/conference/code.css";
import useGroupStore from "../../store/group.js";
import useAuthStore from "../../store/auth.js";
import MyCodeListModal from "../../modals/MyCodeListModal.jsx";

const Code = ({ toggleVideo, isOpen, groupId }) => {
  const [language, setLanguage] = useState("JAVA");
  const [isShared, setIsShared] = useState(false);
  const [personalCodeList, setPersonalCodeList] = useState([]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showIO, setShowIO] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 코드 불러오기 및 실행
  const getCodeList = useGroupStore((state) => state.loadCodeList);
  const runCode = useGroupStore((state) => state.executeCode);
  const getUser = useAuthStore((state) => state.getUserInfo);
  const [showModal, setShowModal] = useState(false);
  const [myCode, setMyCode] = useState("");
  const getCode = useGroupStore((state) => state.loadPersonalCode);
  const saveCode = useGroupStore((state) => state.updateCodeFile);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    if (isShared) {
      setShowIO(false); // 공유 코드 모드로 전환 시 인풋/아웃풋 창을 숨김
    }
  }, [isShared]);

  const switchToPersonalMode = () => {
    setIsShared(false);
  };

  const switchToSharedMode = () => {
    setIsShared(true);
  };

  // 모달 오픈 상태
  const handleModalShow = async () => {
    const userInfo = await getUser();
    const folders = await getCodeList({ groupId, userId: userInfo.userId });
    console.log(folders);
    setPersonalCodeList(Array.isArray(folders) ? folders : []);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  // 코드 선택했을 때 내용 불러오기
  const loadCode = async ({ codeId }) => {
    const response = await getCode({ groupId, codeId });
    setMyCode(response.content);
    localStorage.setItem("myCode", response.content);
    handleModalClose();
  };

  const handleEditorChange = (value) => {
    console.log(value);
    setMyCode(value);
    localStorage.setItem("myCode", value);
  };

  const toggleCompiler = () => {
    setShowIO(!showIO); // 입력 및 출력 영역 표시
  };

  // 코드 실행
  const handleExecute = async () => {
    const content = myCode.toString();
    setIsLoading(true);
    try {
      const response = await runCode({ content, language, input: input });
      console.log(response);
      setOutput(response.results);
    } catch (err) {
      console.error("실행  실패", err);
    } finally {
      setIsLoading(false); // 실행 완료 후 로딩 상태 해제
    }
  };

  // 코드 저장
  const saveMyCode = async () => {
    const pageId = 6;
    try {
      saveCode({ groupId, pageId, code: myCode, language });
    } catch (err) {
      console.log("코드 저장 실패 -> ", err);
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
            <option value="JAVA">Java</option>
            <option value="PYTHON">Python</option>
          </select>
        </div>
        <div>
          {/* <button className="button" onClick={toggleVideo}>
            {isOpen ? "⇑" : "⇓"}
          </button> */}
        </div>
      </div>
      <div className="code-space">
        {isShared ? (
          <ShareCode groupId={groupId} language={language} isOpen={isOpen} />
        ) : (
          <Editor
            // theme="vs-dark"
            key={language}
            options={{
              minimap: { enabled: false },
            }}
            className="code-editor"
            language={language.toLowerCase()}
            value={myCode}
            onChange={handleEditorChange}
          />
        )}
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
      </div>
      {
        !isShared ? (
          <div>
            <div className="code-lower-space">
              <div className="code-buttons">
                <button className="button" onClick={handleModalShow}>
                  코드 불러오기
                </button>
                <button className="button" onClick={saveMyCode}>
                  코드 저장
                </button>
              </div>
              <div className="compile-button">
                <button className="button" onClick={toggleCompiler}>
                  {showIO ? "컴파일러 닫기" : "컴파일러"}
                </button>
                {showIO && (
                  <button
                    className="button"
                    onClick={handleExecute}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i
                          className="fas fa-spinner fa-spin"
                          style={{ marginRight: "5px" }}
                        ></i>
                        실행중...
                      </>
                    ) : (
                      "실행"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null

        // <div className="code-lower-space"></div>
      }
      <MyCodeListModal
        show={showModal}
        handleClose={handleModalClose}
        personalCodeList={personalCodeList}
        loadCode={loadCode}
      />
    </div>
  );
};

export default Code;
