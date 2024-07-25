// src/components/accounts/passwordChange.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 네비게이션을 위한 useNavigate 훅을 임포트합니다.
import "../../css/accounts/passwordChange.css";

const PasswordChange = () => {
  const navigate = useNavigate();
  const toBack = () => {
    navigate("/userinfochange");
  };

  return (
    <div id="pw-change-container">
      <div id="pw-change-box">
        <div id="pw-change-title">비밀번호 변경</div>

        <div id="current-pw-group">
          <label id="current-pw-label" htmlFor="current-pw">
            현재 비밀번호
          </label>
          <input
            id="current-pw-input"
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
          />
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

        <div id="pw-change-btn-group">
          <button id="pw-change-change-pw-btn">비밀번호 변경</button>
          <button id="pw-change-back-btn" onClick={toBack}>
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
