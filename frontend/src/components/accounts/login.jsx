// src/components/accounts/login.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/accounts/login.css";

const Login = () => {
  console.log("login");
  const navigate = useNavigate();
  const toSignUp = () => {
    navigate("/signUp");
  };

  return (
    <div id="login-container">
      <div id="login-box">
        <div id="login-title">로그인</div>

        <div id="login-email-group">
          <label id="login-email-label" htmlFor="login-email">
            이메일
          </label>
          <input
            id="login-email-input"
            type="email"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div id="login-pw-group">
          <label id="login-pw-label" htmlFor="login-pw">
            비밀번호
          </label>
          <input
            id="login-pw-input"
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
          <Link to="/password-find" id="pw-find-link">
            비밀번호 찾기
          </Link>
        </div>

        <button id="login-btn">로그인</button>

        {/* 구분선 */}
        <div id="login-separator-line"></div>

        {/* 소셜 로그인 섹션 */}
        <div id="social-login-box">
          <div id="social-login-title">소셜 로그인</div>
          <div id="social-login-btns">
            <button id="social-login-btn-naver">
              <img
                id="social-icon-naver"
                src=""
                // alt="네이버 아이콘"
              />
              <span>네이버로 로그인</span>
            </button>

            {/* 카카오 로그인 버튼 */}
            <button id="social-login-btn-kakao">
              <img
                id="social-icon-kakao"
                src=""
                // alt="카카오 아이콘"
              />
              <span>카카오로 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
