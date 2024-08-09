import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/accounts/passwordChange.css';
import useAuthStore from "../../store/auth";

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState(''); 
  
  const [newPassword, setNewPassword] = useState(''); 
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(''); 
  const [isPasswordValid, setIsPasswordValid] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState();
  
  const [passwordChangeErrorMessage, setPasswordChangeErrorMessage] = useState(''); 

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken)
  const passwordChange = useAuthStore((state) => state.passwordChange);
  
  const handleOldPasswordInput = (event) => {
    setPasswordChangeErrorMessage("")
    setOldPassword(event.target.value);
  };

  // 새 비밀번호 입력 핸들러
  const handleNewPasswordInput = (event) => {
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
    const accessToken = getAccessToken()
    const userId = getUserInfo().userId
    try {
      await passwordChange({ accessToken, userId, oldPassword, newPassword });
      window.alert("비밀번호를 변경했습니다.")
      navigate(`../users/${userId}`);
    } catch (error) {
      if (error.response.data.error.auth) {
        let errorMessage;
        if (error.response.data.error.auth === "password is incorrect.") {
          errorMessage = "현재 비밀번호가 일치하지 않습니다."
          setOldPassword("")
        }
        setPasswordChangeErrorMessage( errorMessage || "이메일과 비밀번호를 확인해주세요.");
      }
    }
  };

  const navigate = useNavigate();

  const handleToBack = () => {
    const userId = getUserInfo().userId
    navigate(`../users/${userId}`);
  };

  return (
    <div id="pw-change-container">
      <div id="pw-change-box">
        <div id="pw-change-title">비밀번호 변경</div>

        <div id="current-pw-group">
          <label id="current-pw-label" htmlFor="current-pw">
            현재 비밀번호
          </label>
          <input
            id="current-pw-input"
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
            value={oldPassword}
            onChange={handleOldPasswordInput}
          />
        </div>

        <div id="new-pw-group">
          <label id="new-pw-label" htmlFor="new-pw">
            새 비밀번호
          </label>
          <input
            id="new-pw-input"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={handleNewPasswordInput}
          />
          {passwordErrorMessage && <div id="password-fail-message">{passwordErrorMessage}</div>}
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
            onChange={handleConfirmPasswordInput}
          />
          { confirmPassword && !matchPassword && <div id="password-confirm-fail-message">비밀번호가 일치하지 않습니다.</div>}
          { matchPassword && <div id="password-confirm-success-message">비밀번호가 일치합니다.</div>}
        </div>

         {passwordChangeErrorMessage && <p id="passwordchange-error-message">{passwordChangeErrorMessage}</p>}

        <div id="pw-change-btn-group">
          <button id="pw-change-change-pw-btn"
           onClick={handleChangePasswordButton}
           disabled={!isPasswordValid || !matchPassword}
          >
            비밀번호 변경
            </button>

          <button id="pw-change-back-btn" onClick={handleToBack}>
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
