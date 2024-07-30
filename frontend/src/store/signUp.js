import axios from "axios"; // HTTP 요청을 보내기 위한 axios 라이브러리 불러오기
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅 불러오기
import { useState, useEffect } from "react"; // 상태 관리와 사이드 이펙트를 처리하기 위한 useState와 useEffect 훅 불러오기

// 커스텀 훅: 회원가입 관련 상태와 핸들러를 관리
const useSignUp = () => {
  // 상태 정의
  const [email, setEmail] = useState(""); // 이메일 상태와 업데이트 함수 정의
  const [authToken, setAuthToken] = useState(""); // 인증 토큰 상태와 업데이트 함수 정의
  const [password, setPassword] = useState(""); // 비밀번호 상태와 업데이트 함수 정의
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태와 업데이트 함수 정의
  const [nickname, setNickname] = useState(""); // 닉네임 상태와 업데이트 함수 정의
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 상태와 업데이트 함수 정의
  const [emailSending, setEmailSending] = useState(false); // 이메일 전송 중 여부 상태와 업데이트 함수 정의
  const [emailSent, setEmailSent] = useState(false); // 이메일 전송 여부 상태와 업데이트 함수 정의
  const [authVerified, setAuthVerified] = useState(false); // 인증 확인 상태와 업데이트 함수 정의
  const [authError, setAuthError] = useState(""); // 인증 오류 메시지 상태와 업데이트 함수 정의
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지 상태와 업데이트 함수 정의
  const [passwordMatchError, setPasswordMatchError] = useState(""); // 비밀번호 일치 오류 메시지 상태와 업데이트 함수 정의
  const [passwordMatchSuccess, setPasswordMatchSuccess] = useState(""); // 비밀번호 일치 성공 메시지 상태와 업데이트 함수 정의
  const [nicknameError, setNicknameError] = useState(""); // 닉네임 오류 메시지 상태와 업데이트 함수 정의
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const [nicknameCheckError, setNicknameCheckError] = useState(""); // 닉네임 중복 확인 오류 메시지 상태와 업데이트 함수 정의
  const [isNicknameValid, setIsNicknameValid] = useState(false); // 닉네임 유효성 여부 상태와 업데이트 함수 정의
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 여부 상태와 업데이트 함수 정의
  const [emailError, setEmailError] = useState(""); // 이메일 오류 메시지 상태와 업데이트 함수 정의
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 정의

  // 이메일 입력 핸들러
  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    // 이메일 유효성 검증
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      setIsEmailValid(false);
      setEmailError("이메일 형식에 맞춰 입력해주세요.");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  };

  // 인증 토큰 입력 핸들러
  const handleAuthTokenChange = (event) => {
    const authTokenValue = event.target.value;
    setAuthToken(authTokenValue);
  };

  // 비밀번호 입력 핸들러---ok
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    // 비밀번호 유효성 검증
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,13}$/;
    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "비밀번호는 문자, 숫자, 특수문자를 조합해주세요. (8~13자)"
      );
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 입력 핸들러---ok
  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    // 비밀번호 확인 유효성 검증
    if (password !== newConfirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
      setPasswordMatchSuccess("");
    } else {
      setPasswordMatchError("");
      setPasswordMatchSuccess("비밀번호가 일치합니다.");
    }
  };

  // 닉네임 입력 핸들러---ok
  const handleNicknameChange = (event) => {
    const newNickname = event.target.value;
    setNickname(newNickname);

    // 닉네임 유효성 검증
    const nicknamePattern = /^[A-Za-z0-9가-힣]{2,10}$/;
    if (!nicknamePattern.test(newNickname)) {
      setIsNicknameValid(false);
      setNicknameError("닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.");
    } else {
      setIsNicknameValid(true);
      setNicknameError("");
    }
  };

  // 이메일 전송 핸들러---ok
  const handleSendEmail = async () => {
    console.log(`이메일 전송 중: ${email}`);
    setEmailSending(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth-codes/send-code",
        { email }
      );
      if (response.status === 200) {
        const { expiredTime } = response.data; // 응답 데이터에서 expiredTime 추출
        console.log(`${expiredTime}을 돌려받음`);
        setEmailSending(false);
        setEmailSent(true); // 이메일 전송 성공 상태 설정
        setTimeLeft(expiredTime * 60); // 타이머를 분 단위로 초로 변환하여 설정
      }
    } catch (error) {
      setEmailSending(false);
      setEmailError("이메일 전송에 실패했습니다."); // 이메일 전송 실패 시 오류 메시지 설정
    }
  };

  // 이메일 재전송 핸들러---ok
  const handleResendEmail = () => {
    console.log(`이메일 재전송 중: ${email}`);
    setEmailSent(false); // 이메일 전송 상태를 false로 설정
    setTimeLeft(0); // 남은 시간 초기화
    handleSendEmail(); // 이메일 전송 함수 호출
  };

  // 인증 토큰 확인 핸들러
  const handleAuthToken = async () => {
    console.log(
      `인증 토큰 확인 중...
      {
      이메일 : ${email},
      인증번호 : ${authToken}
    }`
    );
    try {
      const response = await axios.post(
        "http://localhost:8080/auth-codes/verify-code",
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

  // 닉네임 중복 확인 핸들러
  const handleNicknameCheck = async () => {
    console.log(`닉네임 검사 중: ${nickname}`);
    setNicknameChecking(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/check-nickname",
        { nickName: nickname }
      );
      if (response.status === 200) {
        setNicknameChecking(false);
        setNicknameCheckError("사용할 수 있는 닉네임입니다.");
      }
    } catch (error) {
      setNicknameChecking(false);
      setNicknameCheckError("사용 불가능한 닉네임입니다.");
    }
  };

  // 회원가입 핸들러
  const handleSignUp = async () => {
    console.log(
      `회원가입 진행 중: 이메일=${email}, 비밀번호=${password}, 닉네임=${nickname}`
    );
    try {
      const response = await axios.post("http://localhost:8080/auth/signup", {
        email,
        password,
        nickName: nickname,
      });
      if (response.status === 200) {
        console.log(`${nickname}님, 회원가입 감사합니다.`);
        navigate("/");
      }
    } catch (error) {
      console.error("회원가입에 실패했습니다.");
    }
  };

  // 타이머 업데이트 및 종료 핸들러
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval); // 인터벌 종료
            return 0; // 남은 시간을 0으로 설정
          }
          return prevTime - 1; // 남은 시간을 1초 감소
        });
      }, 1000);
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [timeLeft]); // timeLeft 상태가 변경될 때마다 useEffect 실행

  // 시간 포맷팅 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60); // 분 계산
    const seconds = time % 60; // 초 계산
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // "분:초" 형식으로 반환
  };

  // 회원가입 버튼 활성화 여부
  const isSignUpButtonEnabled =
    emailSent && // 이메일이 전송된 경우
    authVerified && // 인증이 확인된 경우
    !passwordError && // 비밀번호 오류가 없는 경우
    !passwordMatchError; // 비밀번호 일치 오류가 없는 경우

  return {
    // 훅이 반환하는 값
    email, // 이메일 상태
    authToken, // 인증 토큰 상태
    password, // 비밀번호 상태
    confirmPassword, // 비밀번호 확인 상태
    nickname, // 닉네임 상태
    timeLeft, // 남은 시간
    emailSending,
    emailSent, // 이메일 전송 여부
    authVerified, // 인증 확인 여부
    authError, // 인증 오류 메시지
    passwordError, // 비밀번호 오류 메시지
    passwordMatchError, // 비밀번호 일치 오류 메시지
    passwordMatchSuccess, // 비밀번호 일치 성공 메시지
    nicknameError, // 닉네임 오류 메시지
    nicknameChecking,
    nicknameCheckError, // 닉네임 중복 확인 오류 메시지
    isNicknameValid, // 닉네임 유효성 여부
    isEmailValid, // 이메일 유효성 여부
    emailError, // 이메일 오류 메시지
    handleEmailChange, // 이메일 입력 핸들러
    handleAuthTokenChange, // 인증 토큰 입력 핸들러
    handlePasswordChange, // 비밀번호 입력 핸들러
    handleConfirmPasswordChange, // 비밀번호 확인 입력 핸들러
    handleNicknameChange, // 닉네임 입력 핸들러
    handleSendEmail, // 이메일 전송 핸들러
    handleAuthToken, // 인증 토큰 확인 핸들러
    handleNicknameCheck, // 닉네임 중복 확인 핸들러
    handleSignUp, // 회원가입 핸들러
    formatTime, // 시간 포맷팅 함수
    handleResendEmail, // 이메일 재전송 핸들러
    isSignUpButtonEnabled, // 회원가입 버튼 활성화 여부
  };
};

export default useSignUp; // useSignUp 훅을 기본 내보내기
