// src/store/auth.js

// 액세스 토큰을 가져오는 함수
export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

// 리프레시 토큰을 가져오는 함수
export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

// 사용자 정보를 가져오는 함수
export const getUserInfo = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
};

// 로그인 여부를 확인하는 함수
export const isLogin = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
};

// 로그아웃 함수
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");

    // 홈 페이지로 리다이렉트
    window.location.href = "/";
};
