import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/accounts/login.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";
const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 이메일 입력 핸들러
  const handleEmailChange = (e) => setEmail(e.target.value);

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // 로그인 버튼 클릭 핸들러
  const handleLogin = async () => {
    setLoginError(""); // 오류 메시지 초기화
    // 이메일과 비밀번호 입력 여부 검사
    if (!email || !password) {
      setLoginError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    
    try {
      // 로그인 요청
      const { accessToken, refreshToken, userInfo } = await login({ email, password });

      // 로그인 성공 후 그룹페이지로
      navigate(`/`);
    } catch (error) {
      // 로그인 실패 시 에러 메시지 표시
      setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  // 비밀번호 찾기 페이지로 이동
  const handlePasswordFindClick = () => {
    console.log("비밀번호 찾기로 이동");
  };

  // 네이버 로그인 버튼 클릭 핸들러
  const handleNaverLogin = () => {
    // window.location.href = naverURL;
  };

  // 카카오 로그인 버튼 클릭 핸들러
  const handleKakaoLogin = () => {
    console.log("카카오로 로그인으로 이동");
    window.location.href = kakaoURL;
  };

  // 엔터키로 로그인 처리
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 엔터키 동작 방지
      handleLogin(); // 로그인 핸들러 호출
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
            onChange={handleEmailChange}
            onKeyDown={handleKeyDown}
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
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
          />
          <Link
            to="/password-find"
            id="pw-find-link"
            onClick={handlePasswordFindClick}
          >
            비밀번호 찾기
          </Link>
        </div>

        {/* 로그인 오류 메시지 표시 */}
        {loginError && <p id="login-error-msg">{loginError}</p>}

        <button
          id="login-btn"
          onClick={handleLogin} // 로그인 버튼 클릭 핸들러
        >
          로그인        
        </button>

        {/* 구분선 */}
        <div id="login-separator-line"></div>

        {/* 소셜 로그인 섹션 */}
        <div id="social-login-box">
          <div id="social-login-title">소셜 로그인</div>
          <div id="social-login-btns">
            <button id="social-login-btn-naver" onClick={handleNaverLogin}>
              <img id="social-icon-naver" src={naverIcon} alt="네이버 아이콘" />
              <span>네이버로 로그인</span>
            </button>

            <button id="social-login-btn-kakao" onClick={handleKakaoLogin}>
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
