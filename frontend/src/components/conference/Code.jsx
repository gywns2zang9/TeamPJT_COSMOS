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
  const [isSaving, setIsSaving] = useState(false); // 추가된 상태
  const getCodeList = useGroupStore((state) => state.loadCodeList);
  const runCode = useGroupStore((state) => state.executeCode);
  const getUser = useAuthStore((state) => state.getUserInfo);
  const [showModal, setShowModal] = useState(false);
  const [myCode, setMyCode] = useState("");
  const getCode = useGroupStore((state) => state.loadPersonalCode);
  const saveCode = useGroupStore((state) => state.editCode);
  const [codeId, setCodeId] = useState("");
  const [problemName, setProblemName] = useState("");
  const [editor, setEditor] = useState(null);
  const MAX_CODE_LENGTH = 50000; // 코드 최대 길이

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

  const handleModalShow = async () => {
    const userInfo = await getUser();
    const folders = await getCodeList({ groupId, userId: userInfo.userId });
    setPersonalCodeList(Array.isArray(folders) ? folders : []);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const loadCode = async ({ codeId }) => {
    const response = await getCode({ groupId, codeId });
    setMyCode(response.content);
    setCodeId(response.id);
    localStorage.setItem("myCode", response.content);
    handleModalClose();
  };

  const handleEditorChange = (value) => {
    if (value.length > MAX_CODE_LENGTH) {
      alert("최대 코드길이를 초과했습니다. 50000자 이하로 입력해 주세요.");
      value = value.slice(0, MAX_CODE_LENGTH);
      if (editor) {
        const position = editor.getPosition(); // 현재 커서 위치 저장
        const newValue = value.slice(0, MAX_CODE_LENGTH); // 코드 잘라내기
        editor.setValue(newValue); // 잘라낸 코드 설정
        editor.setPosition(position); // 저장한 커서 위치로 복원
      }
      return;
    }
    setMyCode(value);
    localStorage.setItem("myCode", value);
  };

  const toggleCompiler = () => {
    setShowIO(!showIO); // 입력 및 출력 영역 표시
  };

  const handleExecute = async () => {
    const content = myCode.toString();
    setIsLoading(true);
    try {
      const response = await runCode({ content, language, input: input });
      setOutput(response.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // 실행 완료 후 로딩 상태 해제
    }
  };

  const saveMyCode = async () => {
    setIsSaving(true); // 저장 시작 시 로딩 상태로 전환
    try {
      await saveCode({ groupId, codeId, content: myCode, language });
      window.alert("코드 저장 성공!");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false); // 저장 완료 후 로딩 상태 해제
    }
  };

  return (
    <div className="left-space">
      <div className="code-upper-space">
        <div className="actions">
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
        <div className="problem-name">
          <span>{problemName ? problemName : null}</span>
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
            key={language}
            options={{
              minimap: { enabled: false },
            }}
            className="code-editor"
            language={language.toLowerCase()}
            onChange={handleEditorChange}
            value={myCode}
            onMount={(editorInstance) => setEditor(editorInstance)}
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
      {!isShared ? (
        <div>
          <div className="code-lower-space">
            <div className="code-buttons">
              <button className="button" onClick={handleModalShow}>
                코드 불러오기
              </button>
              <button
                className="button"
                onClick={saveMyCode}
                disabled={isSaving} // 저장 중일 때 버튼 비활성화
              >
                {isSaving ? (
                  <>
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ marginRight: "5px" }}
                    ></i>
                    저장중...
                  </>
                ) : (
                  "코드 저장"
                )}
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
      ) : null}
      <MyCodeListModal
        show={showModal}
        handleClose={handleModalClose}
        personalCodeList={personalCodeList}
        loadCode={loadCode}
        setProblemName={setProblemName}
      />
    </div>
  );
};

export default Code;
