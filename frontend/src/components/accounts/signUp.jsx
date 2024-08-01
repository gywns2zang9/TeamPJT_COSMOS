import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/accounts/signUp.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const SignUp = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);
  const [authVerified, setAuthVerified] = useState(false);
  const [authError, setAuthError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [passwordConfirmSuccess, setPasswordConfirmSuccess] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [checkingNickName, setCheckingNickName] = useState(false);
  const [nickNameCheckError, setNickNameCheckError] = useState("");
  const [isNickNameValid, setIsNickNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Store에서 함수와 상태 가져오기
  const { 
    sendSignUpEmail, 
    verifySignUpCode, 
    checkNickName, 
    signUp, 
    login,
    getUserInfo, // getUserInfo 함수 추가
  } = useAuthStore();

  // 이메일 입력 핸들러
  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      setIsEmailValid(false);
      setEmailError("이메일 형식에 맞춰 입력해주세요.");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  };
  
  // 인증코드 입력 핸들러
  const handleAuthCodeChange = (event) => {
    const authCode = event.target.value;
    setAuthCode(authCode);
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,13}$/;
    if (!passwordPattern.test(newPassword)) {
      setPasswordError("비밀번호는 문자, 숫자, 특수문자를 조합해주세요. (8~13자)");
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      setPasswordConfirmSuccess("");
    } else {
      setPasswordConfirmError("");
      setPasswordConfirmSuccess("비밀번호가 일치합니다.");
    }
  };

  // 닉네임 입력 핸들러
  const handleNickNameChange = (event) => {
    const newNickName = event.target.value;
    setNickName(newNickName);
    const nickNamePattern = /^[A-Za-z0-9가-힣]{2,10}$/;
    if (!nickNamePattern.test(newNickName)) {
      setIsNickNameValid(false);
      setNickNameError("닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.");
    } else {
      setIsNickNameValid(true);
      setNickNameError("");
    }
  };

  // 이메일 전송 버튼 핸들러
  const handleSendEmail = async () => {
    console.log(`이메일 전송 중: ${email}`);
    setSendingEmail(true); // 보내지는 중
    try {
      const expiredTime = await sendSignUpEmail({ email });
      setSendingEmail(false);
      setSentEmail(true);
      //시간
    } catch (err) {
      console.log(err);
      setSendingEmail(false);
      setSentEmail(false);
      setEmailError("이메일 전송에 실패했습니다.");
    }
  };

  // 이메일 재전송 핸들러
  const handleResendEmail = () => {
    console.log(`이메일 재전송 중: ${email}`);
    setSentEmail(false);
    handleSendEmail();
  };

  // 인증코드 확인 핸들러
  const handleAuthCode = async () => {
    console.log(`인증코드 확인 중 : ${authCode}`);
    try {
      await verifySignUpCode({ email, authCode });
      setAuthVerified(true);
    } catch (err) {
      setAuthVerified(false);
      setAuthError("인증번호가 올바르지 않습니다.");
    }
  };

  // 닉네임 검사 핸들러
  const handleCheckNickName = async () => {
    console.log(`닉네임 검사 중: ${nickName}`);
    setCheckingNickName(true);
    try {
      await checkNickName({ nickName });
      setCheckingNickName(false);
      setNickNameCheckError("사용할 수 있는 닉네임입니다.");
    } catch (err) {
      setCheckingNickName(false);
      setNickNameCheckError("사용 불가능한 닉네임입니다.");
    }
  };

// 회원가입 핸들러
const handleSignUp = async () => {
  console.log(`회원가입 진행 중: 이메일=${email}, 비밀번호=${password}, 닉네임=${nickName}`);
  try {
    await signUp({ email, password, nickName });
    await login({ email, password });
    const userInfo = getUserInfo();
    navigate(`/users/${userInfo.userId}`);
  } catch (err) {
  }
};

  // 회원가입 버튼 활성화 여부
  const isSignUpButtonEnabled = true

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
              disabled={!email}
            >
              전송
            </button>
          </div>
          {sendingEmail && (
            <div id="email-sending-msg">
              인증번호를 전송 중입니다. 잠시만 기다려주세요.
            </div>
          )}
          {sentEmail && (
            <div id="email-send-success-msg">
              인증번호를 발송했습니다. (유효시간 {})
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
              value={authCode}
              onChange={handleAuthCodeChange}
            />
            <button
              id="auth-btn"
              onClick={handleAuthCode}
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
          {passwordConfirmError && (
            <div id="pw-confirm-fail-msg">{passwordConfirmError}</div>
          )}
          {passwordConfirmSuccess && (
            <div id="pw-confirm-success-msg">{passwordConfirmSuccess}</div>
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
              value={nickName}
              onChange={handleNickNameChange}
            />
            <button
              id="nickname-btn"
              onClick={handleCheckNickName}
              disabled={!isNickNameValid}
            >
              검사
            </button>
          </div>
          {checkingNickName && (
            <div id="nickname-checking-msg">
              닉네임 검사 중입니다. 잠시만 기다려주세요.
            </div>
          )}
          {nickNameError && <div id="nickname-fail-msg">{nickNameError}</div>}
          {nickNameCheckError && (
            <div id="nickname-check-fail-msg">{nickNameCheckError}</div>
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
