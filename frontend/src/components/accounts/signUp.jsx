// src/components/accounts/SignUp.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/accounts/signUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div id="signup-container">
      <div id="signup-box">
        <div id="signup-title">회원가입</div>

        <div id="signup-email-group">
          <label id="signup-email-label" htmlFor="signup-email">
            이메일
          </label>
          <div id="signup-email-input-with-btn">
            <input
              id="signup-email-input"
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

        <div id="signup-pw-group">
          <label id="signup-pw-label" htmlFor="signup-pw">
            비밀번호
          </label>
          <input
            id="signup-pw-input"
            type="password"
            placeholder="비밀번호를 입력하세요"
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

        <div id="signup-nickname-group">
          <label id="signup-nickname-label" htmlFor="signup-nickname">
            닉네임
          </label>
          <div id="signup-nickname-input-with-btn">
            <input
              id="signup-nickname-input"
              type="text"
              placeholder="닉네임을 입력하세요"
            />
            <button id="nickname-btn">검사</button>
          </div>
        </div>

        <button id="signup-btn">회원가입</button>

        {/* 구분선 */}
        <div id="signup-separator-line"></div>

        {/* 소셜 회원가입 섹션 */}
        <div id="social-signup-box">
          <div id="social-signup-title">소셜 회원가입</div>
          <div id="social-signup-btns">
            <button id="social-signup-btn-naver">
              <img
                src=""
                // alt="네이버 아이콘"
                id="social-icon-naver"
              />
              <span>네이버로 회원가입</span>
            </button>

            <button id="social-signup-btn-kakao">
              <img
                src=""
                // alt="카카오 아이콘"
                id="social-icon-kakao"
              />
              <span>카카오로 회원가입</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
