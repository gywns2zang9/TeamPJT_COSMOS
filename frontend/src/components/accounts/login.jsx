import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/accounts/login.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const Login = () => {
  const [email, setEmailInput] = useState("");
  const [password, setPasswordInput] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 이메일 입력 핸들러
  const handleEmailInput = (event) => {
    setLoginErrorMessage(""); // 오류 메시지 초기화
    setEmailInput(event.target.value);
  };
  
  // 비밀번호 입력 핸들러
  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
    setLoginErrorMessage(""); // 오류 메시지 초기화
  };

  // 로그인 버튼 핸들러
  const handleLoginButton = async () => {
    setLoginErrorMessage(""); // 오류 메시지 초기화함

    // 이메일과 비밀번호 입력 여부를 검사하고
    if (!email || !password) {
      setLoginErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    
    try {
      // 로그인 요청 보냄
      const { accessToken, refreshToken, userInfo } = await login({ email, password });
      // 로그인 성공 후 그룹페이지로 (수정필요)
      navigate(`/`);

    } catch (error) {
      // 로그인 실패 시 에러 메시지 표시
      console.log("로그인 실패! ->", error.response.data.error);
      let errorMessage;
      if (error.response.data.error.user) {
        errorMessage = error.response.data.error.user
      } else if (error.response.data.error.auth) {
        errorMessage = error.response.data.error.auth
      }
      setLoginErrorMessage( errorMessage||"이메일과 비밀번호를 확인해주세요.");
    }
  };

  // 비밀번호 찾기 링크 핸들러
  const handlePasswordFindLink = () => {
    console.log("비밀번호 찾기로 이동");
  };

  // 네이버 로그인 버튼 핸들러
  const handleNaverLogin = () => {
    // 임의의 STATE 생성 함수
    const generateRandomString = () => {
      return Math.random().toString(36).slice(2, 10);
    };

    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
    const NAVER_STATE = generateRandomString()
    
    const naverURL= `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${NAVER_STATE}&redirect_uri=${NAVER_REDIRECT_URI}`
    console.log("네이버로 로그인으로 이동");
    window.location.href = naverURL;
  };

  // 카카오 로그인 버튼 핸들러
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    console.log("카카오로 로그인으로 이동");
    window.location.href = kakaoURL;
  };

  // 엔터키로 로그인 처리
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 엔터키 동작 방지
      handleLoginButton(); // 로그인 핸들러 호출
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
            onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
          />
          <Link
            to="/password-find"
            id="password-find-link"
            onClick={handlePasswordFindLink}
          >
            비밀번호 찾기
          </Link>
        </div>

        {/* 로그인 오류 메시지 표시 */}
        {loginErrorMessage && <p id="login-error-message">{loginErrorMessage}</p>}

        <button
          id="login-button"
          onClick={handleLoginButton} // 로그인 버튼 클릭 핸들러
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
