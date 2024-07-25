// src/components/accounts/passwordFind.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/accounts/passwordFind.css";

const PasswordFind = () => {
  console.log("passwordFind");
  const navigate = useNavigate();
  const toBack = () => {
    navigate("/login");
  };

  return (
    <div id="pw-find-container">
      <div id="pw-find-box">
        <div id="pw-find-title">비밀번호 찾기</div>

        <div id="email-auth-group">
          <label id="email-auth-label" htmlFor="email-auth">
            이메일
          </label>
          <div id="email-auth-input-with-btn">
            <input
              id="email-auth-input"
              type="email"
              placeholder="이메일을 입력하세요"
            />
            <button id="send-btn">전송</button>
          </div>
        </div>

        <div id="auth-token-group">
          <label id="auth-token-label" htmlFor="auth-token">
            인증번호 입력
          </label>
          <div id="auth-token-input-with-btn">
            <input
              id="auth-token-input"
              type="text"
              placeholder="인증번호를 입력하세요"
            />
            <button id="auth-btn">확인</button>
          </div>
        </div>

        <div id="new-pw-group">
          <label id="new-pw-label" htmlFor="new-pw">
            새 비밀번호
          </label>
          <input
            id="new-pw-input"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        <div id="confirm-pw-group">
          <label id="confirm-pw-label" htmlFor="confirm-pw">
            비밀번호 확인
          </label>
          <input
            id="confirm-pw-input"
            type="password"
            placeholder="비밀번호를 확인하세요"
          />
        </div>

        <div id="pw-find-btn-group">
          <button id="change-pw-btn">비밀번호 변경</button>
          <button id="back-btn" onClick={toBack}>
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordFind;
