import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [loginError, setLoginError] = useState(""); // 로그인 오류 메시지 상태
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 로그인 요청 상태
  const [accessToken, setAccessToken] = useState(""); // 액세스 토큰 상태
  const [refreshToken, setRefreshToken] = useState(""); // 리프레시 토큰 상태
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const navigate = useNavigate(); // navigate 훅 사용

  // 이메일 입력 핸들러
  const handleEmailChange = (event) => {
    setEmail(event.target.value); // 이메일 상태 업데이트
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // 비밀번호 상태 업데이트
  };

  // 로그인 핸들러
  const handleLogin = async () => {
    setIsLoggingIn(true); // 로그인 요청 상태 true로 설정
    setLoginError(""); // 로그인 오류 메시지 초기화

    // 이메일과 비밀번호 입력 여부 검사
    if (!email && !password) {
      setLoginError("이메일과 비밀번호를 입력해주세요."); // 둘 다 입력되지 않았을 때의 메시지
      setIsLoggingIn(false); // 로그인 요청 상태 false로 설정
      return;
    }
    if (!email) {
      setLoginError("이메일을 입력해주세요."); // 이메일이 비어 있을 때의 메시지
      setIsLoggingIn(false); // 로그인 요청 상태 false로 설정
      return;
    }
    if (!password) {
      setLoginError("비밀번호를 입력해주세요."); // 비밀번호가 비어 있을 때의 메시지
      setIsLoggingIn(false); // 로그인 요청 상태 false로 설정
      return;
    }

    try {
      // 로그인 요청 (백엔드와 통신)
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      // 로그인 성공 시
      console.log("로그인 성공:", response.data);
      const { accessToken, refreshToken, user } = response.data;
      setAccessToken(accessToken); // 액세스 토큰 상태 업데이트
      setRefreshToken(refreshToken); // 리프레시 토큰 상태 업데이트
      setUser(user); // 사용자 정보 상태 업데이트
      setLoginError(""); // 오류 메시지 초기화
    } catch (error) {
      // 로그인 실패 시
      console.error(
        "로그인 실패:",
        error.response?.data?.message || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      setLoginError(errorMessage); // 서버에서 반환된 오류 메시지 설정
    } finally {
      setIsLoggingIn(false); // 로그인 요청 상태 false로 설정
    }
  };

  // 로그인 버튼 클릭 핸들러
  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭됨");
    handleLogin(); // 로그인 핸들러 호출
  };

  // 비밀번호 찾기 페이지로 이동
  const handlePasswordFindClick = () => {
    console.log("비밀번호 찾기로 이동");
  };

  // 네이버 로그인 버튼 클릭 핸들러
  const handleNaverLoginClick = () => {
    console.log("네이버로 로그인으로 이동");
  };

  // 카카오 로그인 버튼 클릭 핸들러
  const handleKakaoLoginClick = () => {
    console.log("카카오로 로그인으로 이동");
  };

  // 회원가입 페이지로 이동
  const toSignUp = () => {
    console.log("회원가입으로 이동");
    navigate("/signUp");
  };

  // 엔터키로 로그인 처리
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 엔터키 동작 방지
      handleLoginClick(); // 로그인 핸들러 호출
    }
  };

  return {
    email,
    password,
    loginError,
    isLoggingIn,
    accessToken,
    refreshToken,
    user,
    handleEmailChange,
    handlePasswordChange,
    handleLoginClick,
    handlePasswordFindClick,
    handleNaverLoginClick,
    handleKakaoLoginClick,
    toSignUp,
    handleKeyDown,
  };
};

export default useLogin;
