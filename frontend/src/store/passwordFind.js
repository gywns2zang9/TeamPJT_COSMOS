// src/store/passwordFind.js
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const usePasswordFind = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [authToken, setAuthToken] = useState('');
  const [authVerified, setAuthVerified] = useState(false);
  const [authError, setAuthError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordMatchSuccess, setPasswordMatchSuccess] = useState('');

  const navigate = useNavigate();

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

  // 이메일 전송 핸들러
  const handleSendEmail = async () => {
    console.log(`이메일 전송 중: ${email}`);
    setEmailSending(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth-codes/find-pwd",
        { email }
      );

      if (response.status === 200) {
        setEmailSending(false);
        setEmailSent(true);
        // 타이머
      }
    } catch {
      setEmailSending(false);
      setEmailError('이메일 전송에 실패했습니다.');
    }
  };

  const handleResendEmail = () => {
    console.log(`이메일 재전송 중: ${email}`);
    setEmailSent(false);
    handleSendEmail();
  };

  // 인증 토큰 입력 핸들러
  const handleAuthTokenChange = (event) => {
    const authTokenValue = event.target.value;
    setAuthToken(authTokenValue);
  };

  // 인증 토큰 확인 핸들러
  const handleAuthToken = async () => {
    console.log(
      `인증 토큰 확인 중... {
          이메일 : ${email},
          인증번호 : ${authToken}
        }`
    );
    try {
      const response = await axios.post(
        "http://localhost:8080/auth-codes/verify-pwd",
        {
          email: email,
          authCode: authToken,
        }
      );
      if (response.status === 200) {
        setAuthVerified(true);
      }
    } catch (error) {
      setAuthError("인증번호가 올바르지 않습니다."); // 인증 실패 시 오류 메시지 설정
    }
  };

  handleAuthToken();

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

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await axios.patch(
        'http://localhost:8080/auth-codes/password',
        {
          email,
          newPassword: password
        }
      );
      if (response.status === 200) {
        console.log("비밀번호가 변경되었습니다.");
        navigate('/login');
      }
    } catch {
      console.error('비밀번호 변경에 실패했습니다.');
    }
  };

  return {
    email,
    isEmailValid,
    emailError,
    emailSending,
    emailSent,
    authToken,
    authVerified,
    authError,
    password,
    passwordError,
    confirmPassword,
    passwordMatchError,
    passwordMatchSuccess,
    handleEmailChange,
    handleSendEmail,
    handleResendEmail,
    handleAuthTokenChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleChangePassword
  };
};

export default usePasswordFind;
