import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/accounts/login.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 이메일 입력 핸들러
  const handleEmailInput = (event) => {
    setLoginErrorMessage(""); 
    setEmail(event.target.value);
  };
  
  // 비밀번호 입력 핸들러
  const handlePasswordInput = (event) => {
    setPassword(event.target.value);
    setLoginErrorMessage("");
  };

  // 로그인 버튼 핸들러
  const handleLoginButton = async () => {
    setLoginErrorMessage(""); 
    if (!email || !password) {
      setLoginErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    try {
      await login({ email, password });
      navigate(`/group`);
    } catch (error) {
      let errorMessage;
       if (error.response.data.error.auth) {
        if (error.response.data.error.auth === "password is incorrect.") {
          errorMessage = "비밀번호가 일치하지 않습니다."
        } else if (error.response.data.error.auth === "kakao email is already exist.") {
          errorMessage = "카카오 계정이 이미 존재합니다."
        } else if (error.response.data.error.auth === "naver email is already exist.") {
          errorMessage = "네이버 계정이 이미 존재합니다."
        }
       } else if (error.response.data.error.user && error.response.data.error.user === "user not found.") {
        errorMessage = "존재하지 않는 유저입니다."
      }
      setLoginErrorMessage( errorMessage || "이메일과 비밀번호를 확인해주세요.");
    }
  };

  // 네이버 로그인 버튼 핸들러
  const handleNaverLogin = () => {
    // STATE 생성 함수
    const generateRandomString = () => {
      return Math.random().toString(36).slice(2, 10);
    };
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
    const NAVER_STATE = generateRandomString()
    const naverURL= `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${NAVER_STATE}&redirect_uri=${NAVER_REDIRECT_URI}`
    window.location.href = naverURL;
  };

  // 카카오 로그인 버튼 핸들러
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  // 엔터키로 로그인 처리
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); 
      handleLoginButton(); 
    }
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
            value={email}
            onChange={handleEmailInput}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div id="login-password-group">
          <label id="login-password-label" htmlFor="login-password">
            비밀번호
          </label>
          <input
            id="login-password-input"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={handlePasswordInput}
            onKeyDown={handleKeyDown}
          />
          <Link
            to="/password-find"
            id="password-find-link"
          >
            비밀번호 찾기
          </Link>
        </div>

        {/* 로그인 오류 메시지 표시 */}
        {loginErrorMessage && <p id="login-error-message">{loginErrorMessage}</p>}

        <button
          id="login-button"
          onClick={handleLoginButton}
        >
          로그인        
        </button>

        {/* 구분선 */}
        <div id="login-separator-line"></div>

        {/* 소셜 로그인 섹션 */}
        <div id="social-login-box">

          <div id="social-login-title">소셜 로그인</div>

          <div id="social-login-buttons">
            <button id="social-login-button-naver" onClick={handleNaverLogin}>
              <img id="social-icon-naver" src={naverIcon} alt="네이버 아이콘" />
              <span>네이버로 로그인</span>
            </button>

            <button id="social-login-button-kakao" onClick={handleKakaoLogin}>
              <img id="social-icon-kakao" src={kakaoIcon} alt="카카오 아이콘" />
              <span>카카오로 로그인</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
