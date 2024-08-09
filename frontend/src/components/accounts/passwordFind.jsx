import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/accounts/passwordFind.css';
import useAuthStore from "../../store/auth";

const PasswordFind = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState(''); 
  const [emailSending, setEmailSending] = useState(false); 
  const [emailSent, setEmailSent] = useState(false); 

  const [timeMessage, setTimeMessage] = useState("");

  const [authCode, setAuthCode] = useState(''); 
  const [authErrorMessage, setAuthErrorMessage] = useState(''); 
  const [authVerified, setAuthVerified] = useState(false); 

  const [newPassword, setNewPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState();

  const sendPasswordFindEmail = useAuthStore((state) => state.sendPasswordFindEmail);
  const verifyAuthCode = useAuthStore((state) => state.verifyAuthCode);
  const changePassword = useAuthStore((state) => state.changePassword);
  const login = useAuthStore((state) => state.login);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);

  const navigate = useNavigate();

  // 이메일 입력 핸들러
  const handleEmailInput = (event) => {
    setEmail(event.target.value);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(event.target.value)) {
      setIsEmailValid(false);
      setEmailError("이메일 형식에 맞춰 입력해주세요.");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  };

  // 코드 전송 버튼 핸들러
  const handleSendCode = async () => {
    setEmailError("");
    setEmailSending(true);
    setEmailSent(false);

    try {
      const expiredTime = await sendPasswordFindEmail({ email });
      // 타이머 함수
      const Timer = (minutes) => {
        let totalTime = minutes * 60;
        const intervalId = setInterval(() => {
          if (totalTime >= 0) {
            const min = Math.floor(totalTime / 60);
            const sec = totalTime % 60;
            setTimeMessage(`${min}:${sec < 10 ? '0' : ''}${sec}`);
            totalTime--;
          } else {
            clearInterval(intervalId);
            console.log("타이머 종료");
            setTimeMessage("인증시간 만료");
          }
        }, 1000);
      };
      setEmailSending(false); 
      setEmailSent(true);
      Timer(expiredTime);
    } catch (error) {
      setEmailSending(false);
      let errorMessage;
      if (error.response.data.error.user) {
        errorMessage = "존재하지 않는 유저입니다."
      }
      setEmailError(errorMessage || "이메일 전송에 실패했습니다.");
    }
  };

  // 이메일 재전송 핸들러
  const handleResendCode = () => {
    handleSendCode();
  };

  // 인증 코드 입력 핸들러
  const handleAuthCodeInput = (event) => {
    setAuthErrorMessage("");
    setAuthCode(event.target.value);
  };

  // 인증 코드 확인 핸들러
  const handleAuthCode = async () => {
    try {
      const response = await verifyAuthCode({ email, authCode });
      setAuthVerified(response);
      setAuthErrorMessage("");
    } catch (error) {
      setAuthErrorMessage("인증번호가 올바르지 않습니다.");
    }
  };

  // 비밀번호 입력 핸들러
  const handlePasswordInput = (event) => {
    setNewPassword(event.target.value);
    setMatchPassword(false)
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,13}$/;
    if (!passwordPattern.test(event.target.value)) {
      setIsPasswordValid(false);
      setPasswordErrorMessage("비밀번호는 문자, 숫자, 특수문자를 조합해주세요. (8~13자)");
    } else {
      setIsPasswordValid(true);
      setPasswordErrorMessage("");
    }
    if (confirmPassword === event.target.value) {
      setMatchPassword(true)
    } else {
      setMatchPassword(false)
    }
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordInput = (event) => {
    setConfirmPassword(event.target.value);
    setMatchPassword(false)
    if (newPassword !== event.target.value) {
      setMatchPassword(false)
    } else {
      setMatchPassword(true)
    }
  };

  // 비밀번호 변경 버튼 핸들러
  const handleChangePasswordButton = async () => {
    if (newPassword !== confirmPassword) {
      setMatchPassword(false)
      return;
    }
    try {
      await changePassword({ email, newPassword }); 
      await login({ email, newPassword });
      const userInfo = getUserInfo();
      navigate(`/users/${userInfo.userId}`);
    } catch (error) {
    }
  };

  return (
    <div id="password-find-container">
      <div id="password-find-box">
        <div id="password-find-title">비밀번호 찾기</div>

        <div id="email-auth-group">
          <label id="email-auth-label" htmlFor="email-auth">이메일</label>
          <div id="email-auth-input-with-button">
            <input
              id="email-auth-input"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailInput}
              disabled={authVerified}
            />
            <button
              id="send-button"
              onClick={handleSendCode}
              disabled={authVerified || !isEmailValid}
            >
              전송
            </button>
          </div>
          {emailSending && <div id="email-sending-message">인증번호를 전송 중입니다. 잠시만 기다려주세요.</div>}
          {emailSent && (
            <div id="email-send-success-message">
              인증번호를 발송했습니다. {timeMessage && <span>{timeMessage}</span>}
              <div>
                인증번호가 오지 않았나요?
                <b id="email-send-fail-message" onClick={handleResendCode}> 재전송</b>
              </div>
            </div>
          )}
          {emailError && <div id="email-fail-message">{emailError}</div>}
        </div>

        <div id="auth-code-group">
          <label id="auth-code-label" htmlFor="auth-code">인증번호 입력</label>
          <div id="auth-code-input-with-button">
            <input
              id="auth-code-input"
              type="text"
              placeholder="인증번호를 입력하세요"
              value={authCode}
              onChange={handleAuthCodeInput}
              disabled={authVerified || !emailSent}
            />
            <button
              id="auth-button"
              onClick={handleAuthCode}
              disabled={authVerified || !emailSent}
            >
              확인
            </button>
          </div>
          {authVerified && <div id="auth-success-message">인증되었습니다.</div>}
          {authErrorMessage && <div id="auth-fail-message">{authErrorMessage}</div>}
        </div>

        <div id="new-password-group">
          <label id="new-password-label" htmlFor="new-password">새 비밀번호</label>
          <input
            id="new-password-input"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={handlePasswordInput}
          />
          {passwordErrorMessage && <div id="password-fail-message">{passwordErrorMessage}</div>}
        </div>

        <div id="confirm-password-group">
          <label id="confirm-password-label" htmlFor="confirm-password">비밀번호 확인</label>
          <input
            id="confirm-password-input"
            type="password"
            placeholder="비밀번호를 확인하세요"
            value={confirmPassword}
            onChange={handleConfirmPasswordInput}
          />
          { confirmPassword && !matchPassword && <div id="password-confirm-fail-message">비밀번호가 일치하지 않습니다.</div>}
          { matchPassword && <div id="password-confirm-success-message">비밀번호가 일치합니다.</div>}
        </div>

        <button
          id="change-password-button"
          onClick={handleChangePasswordButton}
          disabled={!authVerified || !isPasswordValid || !matchPassword}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default PasswordFind;
