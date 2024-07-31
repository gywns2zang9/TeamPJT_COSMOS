import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [loginError, setLoginError] = useState(""); // 로그인 오류 메시지 상태
  const [accessToken, setAccessToken] = useState(""); // 액세스 토큰 상태
  const [refreshToken, setRefreshToken] = useState(""); // 리프레시 토큰 상태
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const navigate = useNavigate(); // 네비게이션 훅

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
    setLoginError(""); // 로그인 오류 메시지 초기화

    // 이메일과 비밀번호 입력 여부 검사
    if (!email || !password) { // email 또는 password 중 하나라도 값이 없는 경우
      setLoginError("이메일과 비밀번호를 입력해주세요."); // 입력되지 않았을 때의 메시지
      return;
    }
    try {
      // 로그인 요청 (백엔드와 통신)
      const response = await axios.post("http://i11a708.p.ssafy.io:5000/api/sessions/login", {
        email,
        password,
      });

      // 로그인 성공 시
      console.log("로그인 성공:", response.data);
      const { accessToken, refreshToken, userInfo } = response.data;
      setAccessToken(accessToken); // 액세스 토큰 상태 업데이트
      setRefreshToken(refreshToken); // 리프레시 토큰 상태 업데이트
      setUserInfo(userInfo); // 사용자 정보 상태 업데이트
      setLoginError(""); // 오류 메시지 초기화

      // 토큰을 localStorage에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // 리다이렉션
      navigate(`/users/${userInfo.userId}`);
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

  // 엔터키로 로그인 처리
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 엔터키 동작 방지
      handleLoginClick(); // 로그인 핸들러 호출
    }
  };

  // 컴포넌트가 마운트될 때 로그인 상태를 확인
  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUserInfo = localStorage.getItem("userInfo");

    if (savedAccessToken && savedRefreshToken && savedUserInfo) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  return {
    email,
    password,
    loginError,
    accessToken,
    refreshToken,
    userInfo,
    handleEmailChange,
    handlePasswordChange,
    handleLoginClick,
    handlePasswordFindClick,
    handleNaverLoginClick,
    handleKakaoLoginClick,
    handleKeyDown,
  };
};

export default useLogin;
