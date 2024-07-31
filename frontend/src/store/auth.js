// src/store/auth.js
import { deleteRequest, get, patch, post } from '../api/api.js'
import useStore from './index.js'

const BASE_URL = useStore.getState().BASE_URL;

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

// 로그인 요청 함수
export const login = async ({ email, password }) => {

    try {
        const url = `${BASE_URL}/auth/login`;
        const data = {
            email,
            password
        };
        const responseData = await post(url, data);
        const { accessToken, refreshToken, userInfo } = responseData;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("로그인 성공")
        return { accessToken, refreshToken, userInfo };

    } catch (err) {
        console.log("로그인 실패->", err);
        throw err;
    }
};

// 로그아웃 함수
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");

    // 홈 페이지로 리다이렉트
    window.location.href = "/";
};

// 로그인 여부를 확인하는 함수
export const isLogin = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
};

