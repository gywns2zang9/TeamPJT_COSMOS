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
    console.log("auth.js에서 로그인 요청 실행")
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
        console.log(`로그인 성공! -> ${userInfo.nickName}님, 환영합니다!`)
        return { accessToken, refreshToken, userInfo };

    } catch (err) {
        console.log("로그인 실패! ->", err);
        throw err;
    }
};

// 로그아웃 함수
export const logout = () => {

    console.log(`로그아웃 성공!`)
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

// 비번찾기-이메일전송 함수
export const sendEmailPasswordFind = async ({ email }) => {
    console.log(`${email}받음`)
    try {
        const url = `${BASE_URL}/auth-codes/find-pwd`;
        const data = {
            email
        };
        const expiredTime = await post(url, data);
        return expiredTime;

    } catch (err) {
        console.error("이메일 전송에 실패! ->", err);
        throw err;
    }
};

// 인증 토큰 확인 함수
export const verifyAuthToken = async ({ email, authToken }) => {
    console.log(`${email}, ${authToken} 받음`);
    try {
        const url = `${BASE_URL}/auth-codes/verify-pwd`;
        const data = {
            email,
            authCode: authToken
        };
        const response = await post(url, data);
        return response;
    } catch (err) {
        console.error("인증번호 확인에 실패! ->", err);
        throw err;
    }
};

// 비밀번호 변경 함수
export const changePassword = async ({ email, password }) => {
    console.log(`${email}, ${password} 받음`);
    try {
        const url = `${BASE_URL}/auth-codes/password`;
        const data = {
            email,
            newPassword: password
        };
        const response = await patch(url, data);
        console.log(response)
        return response
    } catch (err) {
        console.error("비밀번호 변경에 실패! ->", err);
        throw err;
    }
};