import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/accounts/signUp.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState(''); 
  const [emailSending, setEmailSending] = useState(false); 
  const [emailSent, setEmailSent] = useState(false); 

  const [timeMessage, setTimeMessage] = useState("");

  const [authCode, setAuthCode] = useState("");
  const [authErrorMessage, setAuthErrorMessage] = useState(''); 
  const [authVerified, setAuthVerified] = useState(false); 

  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [matchPassword, setMatchPassword] = useState();

  const [nickName, setNickName] = useState("");
  const [nickNameErrorMessage, setNickNameErrorMessage] = useState("");
  const [isNickNameValid, setIsNickNameValid] = useState(false);
  const [nickNameCheckMessage, setNickNameCheckMessage] = useState("");
  const [isNickNameCheck, setIsNickNameCheck] = useState(false);


  const sendSignUpEmail = useAuthStore((state) => state.sendSignUpEmail);
  const verifySignUpCode = useAuthStore((state) => state.verifySignUpCode);
  const checkNickName = useAuthStore((state) => state.checkNickName);
  const signUp = useAuthStore((state) => state.signUp);
  const login = useAuthStore((state) => state.login);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);

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
    setEmailSending(true);
    setEmailSent(false);
    setEmailError("");

    try {
      const expiredTime = await sendSignUpEmail({ email });
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
      console.log(`타이머 시작: ${expiredTime}분`);
      Timer(expiredTime);

    } catch (error) {
      setEmailSending(false);
      let errorMessage;
      if (error.response.data.error.user) {
        errorMessage = error.response.data.error.user
      }
      setEmailError(errorMessage || "이메일 전송에 실패했습니다.");
      
    }
  };
  // 코드 재전송 핸들러
  const handleResendEmail = () => {
    handleSendCode();
  };

  // 인증 코드 입력 핸들러
  const handleAuthCodeInput = (event) => {
    setAuthErrorMessage("");
    setAuthCode(event.target.value);
  };
  // 인증코드 확인 핸들러
  const handleAuthCode = async () => {
    try {
      const response = await verifySignUpCode({ email, authCode });
      setAuthVerified(response);
      setAuthErrorMessage("");
    } catch (error) {
      console.log(error.response.data.error);
      setAuthErrorMessage("인증번호가 올바르지 않습니다.");
    }
  };

  // 비밀번호 입력 핸들러
  const handlePasswordInput = (event) => {
    setMatchPassword(false)
    setPassword(event.target.value);
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,13}$/;
    if (!passwordPattern.test(event.target.value)) {
      setPasswordErrorMessage("비밀번호는 문자, 숫자, 특수문자를 조합해주세요. (8~13자)");
    } else {
      setPasswordErrorMessage("");
    }
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordInput = (event) => {
    setConfirmPassword(event.target.value);
    if (password !== event.target.value) {
      setMatchPassword(false)
    } else {
      setMatchPassword(true)
    }
  };

  // 닉네임 입력 핸들러
  const handleNickNameInput = (event) => {
    setIsNickNameCheck(false)
    setNickNameCheckMessage("");
    setNickName(event.target.value);
    const nickNamePattern = /^[A-Za-z0-9가-힣]{2,10}$/;
    if (!nickNamePattern.test(event.target.value)) {
      setIsNickNameValid(false);
      setNickNameErrorMessage("닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.");
    } else {
      setIsNickNameValid(true);
      setNickNameErrorMessage("");
    }
  };


  // 닉네임 검사 핸들러
  const handleCheckNickName = async () => {
    if (!isNickNameValid){
      return
    }
    try {
      await checkNickName({ nickName });
      setIsNickNameCheck(true)
      setNickNameCheckMessage("사용가능한 닉네임입니다.");
      
    } catch (error) {
      console.log("닉네임 검사 실패 ->", error.response.data.error);
      let errorMessage;
      if (error.response.data.error.auth) {
        errorMessage = error.response.data.error.auth
      setIsNickNameCheck(false)
      }
      setNickNameCheckMessage(errorMessage||"사용불가능한 닉네임입니다.");
    }
  };

// 회원가입 버튼 핸들러
const handleSignUp = async () => {
  try {
    await signUp({ email, password, nickName });
    await login({ email, password });
    const userInfo = getUserInfo();
    navigate(`/users/${userInfo.userId}`);
  } catch (error) {
    console.log('회원가입에 실패했습니다.');
  }
};

// 네이버 로그인 버튼 핸들러
const handleNaverSignUp = () => {
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
const handleKakaoSignup = () => {
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  console.log("카카오로 로그인으로 이동");
  window.location.href = kakaoURL;
};
  return (
    <div id="signup-container">
      <div id="signup-box">
        <div id="signup-title">회원가입</div>

        <div id="signup-email-group">
          <label id="signup-email-label" htmlFor="signup-email">
            이메일
          </label>
          <div id="signup-email-input-with-button">
            <input
              id="signup-email-input"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onInput={handleEmailInput}
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
                <b id="email-send-fail-message" onClick={handleResendEmail}> 재전송</b>
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

        <div id="signup-password-group">
          <label id="signup-password-label" htmlFor="signup-password">
            비밀번호
          </label>
          <input
            id="signup-password-input"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onInput={handlePasswordInput}
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

        <div id="signup-nickname-group">
          <label id="signup-nickname-label" htmlFor="signup-nickname">닉네임</label>
          <div id="signup-nickname-input-with-button">
            <input
              id="signup-nickname-input"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickName}
              onInput={handleNickNameInput}
            />
            <button
              id="nickname-button"
              onClick={handleCheckNickName}
              disabled={!isNickNameValid}
            >
              검사
            </button>
          </div>
          {nickName && nickNameErrorMessage && <div id="nickname-fail-message">{nickNameErrorMessage}</div>}
          {isNickNameValid && isNickNameCheck && <div id="nickname-check-success-message">{nickNameCheckMessage}</div>}
          {isNickNameValid && !isNickNameCheck && <div id="nickname-check-fail-message">{nickNameCheckMessage}</div>}
        </div>

        <button
          id="signup-button"
          onClick={handleSignUp}
          disabled={!authVerified || !matchPassword || !isNickNameCheck}
        >
          회원가입
        </button>

        {/* 구분선 */}
        <div id="signup-separator-line"></div>

        <div id="social-signup-box">
          <div id="social-signup-title">소셜 회원가입</div>

          <div id="social-signup-buttons">
            <button id="social-signup-button-naver" onClick={handleNaverSignUp}>
              <img id="social-icon-naver" src={naverIcon} alt="네이버 아이콘" />
              <span>네이버로 회원가입</span>
            </button>

            <button id="social-signup-button-kakao" onClick={handleKakaoSignup}>
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
