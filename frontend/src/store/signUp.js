import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// 커스텀 훅: 회원가입 관련 상태와 핸들러를 관리
const useSignUp = () => {
  // 상태 정의
  const [email, setEmail] = useState(""); // 이메일 주소 상태
  const [authToken, setAuthToken] = useState(""); // 인증 토큰 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [timer, setTimer] = useState(null); // 타이머 객체 상태
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 상태 (초 단위)
  const [emailSent, setEmailSent] = useState(false); // 이메일 전송 여부 상태
  const [authVerified, setAuthVerified] = useState(false); // 인증 여부 상태
  const [authError, setAuthError] = useState(""); // 인증 오류 메시지 상태
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지 상태
  const [passwordMatchError, setPasswordMatchError] = useState(""); // 비밀번호 불일치 오류 메시지 상태
  const [passwordMatchSuccess, setPasswordMatchSuccess] = useState(""); // 비밀번호 일치 성공 메시지 상태
  const [nicknameError, setNicknameError] = useState(""); // 닉네임 오류 메시지 상태
  const [nicknameCheckError, setNicknameCheckError] = useState(""); // 닉네임 중복 체크 오류 메시지 상태
  const [isNicknameValid, setIsNicknameValid] = useState(false); // 닉네임 유효성 상태
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 상태
  const [emailError, setEmailError] = useState(""); // 이메일 오류 메시지 상태
  const navigate = useNavigate();

  // 이메일 입력 핸들러
  const handleEmailChange = (event) => {
    const emailValue = event.target.value; // 입력된 이메일 값
    setEmail(emailValue); // 이메일 상태 업데이트

    // 이메일 패턴 정의
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 이메일 형식 검증
    if (!emailPattern.test(emailValue)) {
      setIsEmailValid(false); // 이메일이 유효하지 않으면 유효성 상태 false로 설정
      setEmailError("이메일 형식에 맞춰 입력해주세요."); // 이메일 형식 오류 메시지 설정
    } else {
      setIsEmailValid(true); // 이메일이 유효하면 유효성 상태 true로 설정
      setEmailError(""); // 이메일 오류 메시지 초기화
    }
  };

  // 인증 토큰 입력 핸들러
  const handleAuthTokenChange = (event) => {
    setAuthToken(event.target.value); // 인증 토큰 상태 업데이트
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value; // 입력된 비밀번호 값
    setPassword(newPassword); // 비밀번호 상태 업데이트

    // 비밀번호 패턴 정의: 문자, 숫자, 특수문자 포함, 8~13자
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,13}$/;

    // 비밀번호 형식 검증
    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "비밀번호는 문자, 숫자, 특수문자를 조합해주세요. (8~13자) ." // 비밀번호 형식 오류 메시지 설정
      );
    } else {
      setPasswordError(""); // 비밀번호가 유효하면 오류 메시지 초기화
    }
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value; // 입력된 비밀번호 확인 값
    setConfirmPassword(newConfirmPassword); // 비밀번호 확인 상태 업데이트

    // 비밀번호 일치 여부 검증
    if (password !== newConfirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 오류 메시지 설정
      setPasswordMatchSuccess(""); // 비밀번호 일치 성공 메시지 초기화
    } else {
      setPasswordMatchError(""); // 비밀번호 불일치 오류 메시지 초기화
      setPasswordMatchSuccess("비밀번호가 일치합니다."); // 비밀번호 일치 성공 메시지 설정
    }
  };

  // 닉네임 입력 핸들러
  const handleNicknameChange = (event) => {
    const newNickname = event.target.value; // 입력된 닉네임 값
    setNickname(newNickname); // 닉네임 상태 업데이트

    // 닉네임 길이 검증: 2~12자
    if (newNickname.length < 2 || newNickname.length > 12) {
      setNicknameError("닉네임은 2~12자 이내여야 합니다."); // 닉네임 오류 메시지 설정
      setIsNicknameValid(false); // 닉네임 유효성 상태 false로 설정
    } else {
      setNicknameError(""); // 닉네임 오류 메시지 초기화
      setIsNicknameValid(true); // 닉네임 유효성 상태 true로 설정
    }
  };

  // 이메일 전송 핸들러
  const handleSendEmail = async () => {
    try {
      console.log(email);
      await axios.post(
        "http://localhost:8080/auth-codes/send-code",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("이메일 전송 성공");
      setEmailSent(true); // 이메일 전송 상태 true로 설정
      setAuthVerified(false); // 인증 여부 상태 false로 설정
      setAuthError(""); // 인증 오류 메시지 초기화
      setTimeLeft(300); // 타이머 초기값 설정 (300초 = 5분)

      // 이전 타이머가 있을 경우 정리
      if (timer) {
        clearInterval(timer);
      }

      // 새로운 타이머 설정
      const newTimer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(newTimer); // 시간이 0초가 되면 타이머 정리
            return 0;
          }
          return prevTime - 1; // 남은 시간 1초 감소
        });
      }, 1000);

      setTimer(newTimer); // 타이머 상태 업데이트
    } catch (error) {
      console.error(
        "이메일 전송 오류:",
        error.response?.data?.message || error.message
      );
      setAuthError("이메일 전송에 실패했습니다.");
    }
  };

  // 인증 토큰 검사 핸들러
  const handleAuthToken = async () => {
    try {
      const response = await axios.get("http://localhost:8080/verify-code", {
        params: {
          email,
          authCode: authToken,
        },
      });

      if (response.status === 200) {
        setAuthVerified(true); // 인증 성공 시 상태 true로 설정
        setAuthError(""); // 인증 오류 메시지 초기화
        console.log("인증 성공"); // 인증 성공 메시지 로그 출력
      }
    } catch (error) {
      console.error(
        "인증 코드 확인 오류:",
        error.response?.data?.message || error.message
      );
      setAuthError("인증 코드가 일치하지 않습니다.");
      setAuthVerified(false); // 인증 실패 시 상태 false로 설정
    }
  };

  // 닉네임 중복 체크 핸들러
  const handleNicknameCheck = async () => {
    try {
      // 실제 닉네임 중복 체크 요청을 구현합니다.
      const response = await axios.get(
        "http://localhost:8080/auth/check-nickname",
        {
          params: { nickname },
        }
      );

      if (response.data.exists) {
        setNicknameCheckError("중복된 닉네임입니다."); // 중복된 닉네임 오류 메시지 설정
      } else {
        setNicknameCheckError(""); // 중복된 닉네임이 아니면 오류 메시지 초기화
      }
    } catch (error) {
      console.error(
        "닉네임 중복 체크 오류:",
        error.response?.data?.message || error.message
      );
      setNicknameCheckError("닉네임 중복 체크에 실패했습니다.");
    }
  };

  // 회원가입 핸들러
  const handleSignUp = async () => {
    // 비밀번호 일치 여부 검증
    if (password !== confirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 오류 메시지 설정
      return;
    }

    // 비밀번호 오류 검증
    if (passwordError) {
      console.log("비밀번호 오류:", passwordError); // 비밀번호 오류 메시지 로그 출력
      return;
    }

    // 닉네임 오류 및 중복 체크 검증
    if (nicknameError || nicknameCheckError) {
      console.log("닉네임 오류:", nicknameError); // 닉네임 오류 메시지 로그 출력
      console.log("닉네임 중복 체크 오류:", nicknameCheckError); // 닉네임 중복 체크 오류 메시지 로그 출력
      return;
    }

    // 회원가입 요청
    try {
      const response = await axios.post("http://localhost:8080/auth/signup", {
        email,
        password,
        nickName: nickname,
      });

      const { accessToken, refreshToken, user } = response.data;
      console.log("회원가입 성공:", { accessToken, refreshToken, user });
      // 로그인 성공 후 추가 작업 (예: 상태 업데이트, 페이지 이동 등)
      navigate("/user"); // 예를 들어, 대시보드 페이지로 이동
    } catch (error) {
      console.error(
        "회원가입 오류:",
        error.response?.data?.message || error.message
      );
      // 오류 처리 (예: 사용자에게 오류 메시지 표시)
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 정리
      }
    };
  }, [timer]);

  // 인증 시간이 만료되면 상태 업데이트
  useEffect(() => {
    if (timeLeft === 0 && emailSent) {
      setEmailSent(false); // 이메일 전송 상태 false로 설정
      setAuthVerified(false); // 인증 여부 상태 false로 설정
      setAuthError("인증 시간이 만료되었습니다."); // 인증 시간 만료 오류 메시지 설정
    }
  }, [timeLeft, emailSent]);

  // 남은 시간을 분:초 형식으로 포맷
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60); // 분 계산
    const secs = seconds % 60; // 초 계산
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`; // 분:초 형식으로 반환
  };

  // 이메일 재전송 핸들러
  const handleResendEmail = () => {
    console.log("이메일 재전송 대상:", email); // 재전송할 이메일 주소 로그 출력
    handleSendEmail(); // 이메일 재전송 핸들러 호출
  };

  // 회원가입 버튼 활성화 여부 체크
  const isSignUpButtonEnabled =
    authVerified && // 인증 완료
    !passwordError && // 비밀번호 오류 없음
    !passwordMatchError && // 비밀번호 불일치 오류 없음
    !nicknameError && // 닉네임 오류 없음
    !nicknameCheckError && // 닉네임 중복 체크 오류 없음
    isNicknameValid; // 닉네임 유효성 확인

  // 훅의 반환값: 상태와 핸들러
  return {
    email,
    authToken,
    password,
    confirmPassword,
    nickname,
    timer,
    timeLeft,
    emailSent,
    authVerified,
    authError,
    passwordError,
    passwordMatchError,
    passwordMatchSuccess,
    nicknameError,
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
  };
};

export default useSignUp;
