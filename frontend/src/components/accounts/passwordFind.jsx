// src/components/accounts/PasswordFind.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/accounts/passwordFind.css';
import { sendEmailPasswordFind, verifyAuthToken, changePassword } from "../../store/auth";

const PasswordFind = () => {
  const [email, setEmail] = useState(''); // 이메일 상태
  const [isEmailValid, setIsEmailValid] = useState(true); // 이메일 유효성 상태
  const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태
  const [emailSending, setEmailSending] = useState(false); // 이메일 전송 중 상태
  const [emailSent, setEmailSent] = useState(false); // 이메일 전송 완료 상태

  const [authToken, setAuthToken] = useState(''); // 인증 토큰 상태
  const [authVerified, setAuthVerified] = useState(false); // 인증 완료 상태
  const [authError, setAuthError] = useState(''); // 인증 오류 메시지 상태

  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지 상태
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태
  const [passwordMatchError, setPasswordMatchError] = useState(''); // 비밀번호 불일치 오류 메시지 상태
  const [passwordMatchSuccess, setPasswordMatchSuccess] = useState(''); // 비밀번호 일치 성공 메시지 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  // 이메일 입력 변경 핸들러
  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 유효성 검사 패턴
    if (!emailPattern.test(emailValue)) {
      setIsEmailValid(false);
      setEmailError("이메일 형식에 맞춰 입력해주세요.");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  };

  // 이메일 전송 핸들러
  const handleSendEmail = async () => {
    console.log(`${email}로 전송`);
    // setEmailSending(true);
    try {
      const {expiredTime} = await sendEmailPasswordFind({email}); // 이메일 전송 API 호출
      // setEmailSending(false);
      // setEmailSent(true);
      console.log(expiredTime)
    } catch (error) {
      // setEmailSending(false);
      // setEmailError('이메일 전송에 실패했습니다.');
    }
  };

  // 이메일 재전송 핸들러
  const handleResendEmail = () => {
    console.log(`이메일 재전송 중: ${email}`);
    setEmailSent(false);
    handleSendEmail(); // 이메일 전송 함수 호출
  };

  // 인증 토큰 입력 변경 핸들러
  const handleAuthTokenChange = (event) => {
    const authTokenValue = event.target.value;
    setAuthToken(authTokenValue);
  };

  // 인증 토큰 확인 핸들러
  const handleAuthToken = async () => {
    console.log(`인증 토큰 확인 중... {
          이메일 : ${email},
          인증번호 : ${authToken}
        }`);
    try {
      const response = await verifyAuthToken({email, authToken}); // 인증 토큰 확인 API 호출
      console.log(response)
      // setAuthVerified(true);
    } catch (error) {
      setAuthError("인증번호가 올바르지 않습니다.");
    }
  };

  // 비밀번호 입력 변경 핸들러
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,13}$/; // 비밀번호 유효성 검사 패턴
    if (!passwordPattern.test(newPassword)) {
      setPasswordError("비밀번호는 문자, 숫자, 특수문자를 조합해주세요. (8~13자)");
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 입력 변경 핸들러
  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
      setPasswordMatchSuccess("");
    } else {
      setPasswordMatchError("");
      setPasswordMatchSuccess("비밀번호가 일치합니다.");
    }
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await changePassword({email, password}); // 비밀번호 변경 API 호출
      console.log("비밀번호가 변경되었습니다.");
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div id="pw-find-container">
      <div id="pw-find-box">
        <div id="pw-find-title">비밀번호 찾기</div>

        <div id="email-auth-group">
          <label id="email-auth-label" htmlFor="email-auth">이메일</label>
          <div id="email-auth-input-with-btn">
            <input
              id="email-auth-input"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailChange}
            />
            <button
              id="send-btn"
              onClick={handleSendEmail}
              disabled={authVerified || !isEmailValid}
            >
              전송
            </button>
          </div>
          {emailSent && (
            <div id="email-send-success-msg">
              인증번호를 발송했습니다.
              <div>
                인증번호가 오지 않았나요?
                <b id="email-send-fail-msg" onClick={handleResendEmail}> 재전송</b>
              </div>
            </div>
          )}
          {emailError && <div id="email-fail-msg">{emailError}</div>}
        </div>

        <div id="auth-token-group">
          <label id="auth-token-label" htmlFor="auth-token">인증번호 입력</label>
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

        <div id="new-pw-group">
          <label id="new-pw-label" htmlFor="new-pw">새 비밀번호</label>
          <input
            id="new-pw-input"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <div id="pw-fail-msg">{passwordError}</div>}
        </div>

        <div id="confirm-pw-group">
          <label id="confirm-pw-label" htmlFor="confirm-pw">비밀번호 확인</label>
          <input
            id="confirm-pw-input"
            type="password"
            placeholder="비밀번호를 확인하세요"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {passwordMatchError && <div id="pw-confirm-fail-msg">{passwordMatchError}</div>}
          {passwordMatchSuccess && <div id="pw-confirm-success-msg">{passwordMatchSuccess}</div>}
        </div>

        <button
          id="change-pw-btn"
          onClick={handleChangePassword}
          // disabled={!authVerified || passwordError || passwordMatchError}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default PasswordFind;
