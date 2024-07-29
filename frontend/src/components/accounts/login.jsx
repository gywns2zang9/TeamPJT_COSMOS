import { Link } from "react-router-dom";
import useLogin from "../../store/login.js";
import "../../css/accounts/login.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const Login = () => {
  const {
    email,
    password,
    loginError,
    isLoggingIn,
    handleEmailChange,
    handlePasswordChange,
    handleLoginClick,
    handlePasswordFindClick,
    handleNaverLoginClick,
    handleKakaoLoginClick,
    handleKeyDown, // useLogin 훅에서 가져온 handleKeyDown
  } = useLogin(); // 훅에서 상태와 핸들러 가져오기

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
            onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
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
          onClick={handleLoginClick} // 로그인 버튼 클릭 핸들러
          disabled={isLoggingIn} // 로그인 중에는 버튼 비활성화
        >
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>

        {/* 구분선 */}
        <div id="login-separator-line"></div>

        {/* 소셜 로그인 섹션 */}
        <div id="social-login-box">
          <div id="social-login-title">소셜 로그인</div>
          <div id="social-login-btns">
            <button id="social-login-btn-naver" onClick={handleNaverLoginClick}>
              <img id="social-icon-naver" src={naverIcon} alt="네이버 아이콘" />
              <span>네이버로 로그인</span>
            </button>

            <button id="social-login-btn-kakao" onClick={handleKakaoLoginClick}>
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
