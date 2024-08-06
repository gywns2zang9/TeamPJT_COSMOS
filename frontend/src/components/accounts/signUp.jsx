import useSignUp from "../../store/signUp.js";
import "../../css/accounts/signUp.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const SignUp = () => {
  const {
    email,
    authToken,
    password,
    confirmPassword,
    nickname,
    timeLeft,
    emailSending,
    emailSent,
    authVerified,
    authError,
    passwordError,
    passwordMatchError,
    passwordMatchSuccess,
    nicknameError,
    nicknameChecking,
    nicknameCheckError,
    isNicknameValid,
    isEmailValid,
    emailError,
    handleEmailChange,
    handleAuthTokenChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNicknameChange,
    handleSendEmail,
    handleAuthToken,
    handleNicknameCheck,
    handleSignUp,
    formatTime,
    handleResendEmail,
    isSignUpButtonEnabled,
  } = useSignUp();

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
              value={email}
              onChange={handleEmailChange}
            />
            <button
              id="send-btn"
              onClick={handleSendEmail}
              disabled={!isEmailValid}
            >
              전송
            </button>
          </div>
          {emailSending && (
            <div id="email-sending-msg">
              인증번호를 전송 중입니다. 잠시만 기다려주세요.
            </div>
          )}
          {emailSent && (
            <div id="email-send-success-msg">
              인증번호를 발송했습니다. (유효시간 {formatTime(timeLeft)})
              <div>
                인증번호가 오지 않았나요?
                <b id="email-send-fail-msg" onClick={handleResendEmail}>
                  {" "}
                  재전송
                </b>
              </div>
            </div>
          )}
          {emailError && <div id="email-fail-msg">{emailError}</div>}
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
              value={authToken}
              onChange={handleAuthTokenChange}
            />
            <button
              id="auth-btn"
              onClick={handleAuthToken}
              disabled={authVerified}
            >
              확인
            </button>
          </div>
          {authVerified && <div id="auth-success-msg">인증되었습니다.</div>}
          {authError && <div id="auth-fail-msg">{authError}</div>}
        </div>

        <div id="signup-pw-group">
          <label id="signup-pw-label" htmlFor="signup-pw">
            비밀번호
          </label>
          <input
            id="signup-pw-input"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <div id="pw-fail-msg">{passwordError}</div>}
        </div>

        <div id="confirm-pw-group">
          <label id="confirm-pw-label" htmlFor="confirm-pw">
            비밀번호 확인
          </label>
          <input
            id="confirm-pw-input"
            type="password"
            placeholder="비밀번호를 확인하세요"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {passwordMatchError && (
            <div id="pw-confirm-fail-msg">{passwordMatchError}</div>
          )}
          {passwordMatchSuccess && (
            <div id="pw-confirm-success-msg">{passwordMatchSuccess}</div>
          )}
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
              value={nickname}
              onChange={handleNicknameChange}
            />
            <button
              id="nickname-btn"
              onClick={handleNicknameCheck}
              disabled={!isNicknameValid}
            >
              검사
            </button>
          </div>
          {nicknameChecking && (
            <div id="nickname-checking-msg">
              닉네임 검사 중입니다. 잠시만 기다려주세요.
            </div>
          )}
          {nicknameError && <div id="nickname-fail-msg">{nicknameError}</div>}
          {nicknameCheckError && (
            <div id="nickname-check-fail-msg">{nicknameCheckError}</div>
          )}
        </div>

        <button
          id="signup-btn"
          onClick={handleSignUp}
          disabled={!isSignUpButtonEnabled}
        >
          회원가입
        </button>

        <div id="signup-separator-line"></div>

        <div id="social-signup-box">
          <div id="social-signup-title">소셜 회원가입</div>
          <div id="social-signup-btns">
            <button id="social-signup-btn-naver">
              <img id="social-icon-naver" src={naverIcon} alt="네이버 아이콘" />
              <span>네이버로 회원가입</span>
            </button>

            <button id="social-signup-btn-kakao">
              <img id="social-icon-kakao" src={kakaoIcon} alt="카카오 아이콘" />
              <span>카카오로 회원가입</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
