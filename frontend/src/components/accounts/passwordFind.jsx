// src/components/accounts/PasswordFind.jsx
import React from 'react';
import usePasswordFind from '../../store/passwordFind';
import '../../css/accounts/passwordFind.css';

const PasswordFind = () => {
  const {
    email,
    isEmailValid,
    handleEmailChange,
    handleSendEmail,
    emailSent,
    handleResendEmail,
    emailError,

    authToken,
    handleAuthTokenChange,
    handleAuthToken,
    authVerified,
    authError,

    password,
    handlePasswordChange,
    passwordError,

    confirmPassword,
    handleConfirmPasswordChange,
    passwordMatchError,
    passwordMatchSuccess,
    handleChangePassword
  } = usePasswordFind();

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
          disabled={!authVerified || passwordError || passwordMatchError}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default PasswordFind;
