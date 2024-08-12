import { create } from 'zustand';
import { deleteRequest, get, patch, post } from '../api/api.js';
import useStore from './index.js';

const BASE_URL = useStore.getState().BASE_URL;

const useAuthStore = create((set) => ({
    // 상태 변수들
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    userInfo: JSON.parse(localStorage.getItem("userInfo")),

    // 액세스 토큰을 가져오는 함수
    getAccessToken: () => {
        return localStorage.getItem("accessToken");
    },

    // 리프레시 토큰을 가져오는 함수
    getRefreshToken: () => {
        return localStorage.getItem("refreshToken");
    },

    // 액세스 토큰 재발급
    reissuanceAccessToken: async ({ refreshToken }) => {
        console.log(`${refreshToken}로 액세스 토큰 재발급을 시도할게`)
        try {
            const url = `${BASE_URL}/auth/refresh`
            const headers = {
                Authorization: `Bearer ${refreshToken}`,
            };
            const newAccessToken = await get(url, {}, headers);
            console.log("accessToken 재발급:", newAccessToken)
            localStorage.setItem("accessToken", newAccessToken);
            return newAccessToken
        } catch (error) {
            window.alert("세션이 만료되었습니다.")
            localStorage.clear();
            window.location.href = '/login';
        }
    },

    // 사용자 정보를 가져오는 함수
    getUserInfo: () => {
        return JSON.parse(localStorage.getItem("userInfo"));
    },

    // 일반 로그인 요청
    login: async ({ email, password }) => {
        try {
            const url = `${BASE_URL}/auth/login`;
            const data = { email, password };
            const responseData = await post(url, data);
            const { accessToken, refreshToken, userInfo } = responseData;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            set({ accessToken, refreshToken, userInfo });
            return responseData;
        } catch (error) {
            throw error;
        }
    },

    // 카카오 로그인 요청
    kakao: async ({ authorizationCode }) => {
        try {
            const url = `${BASE_URL}/auth/kakao-login`;
            const data = { authorizationCode };
            const responseData = await post(url, data);
            const { accessToken, refreshToken, userInfo } = responseData;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            set({ accessToken, refreshToken, userInfo });
            return responseData;
        } catch (error) {
            throw error;
        }
    },

    naver: async ({ authorizationCode, state }) => {
        try {
            const url = `${BASE_URL}/auth/naver-login`
            const data = { authorizationCode, state };
            const responseData = await post(url, data);
            const { accessToken, refreshToken, userInfo } = responseData;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            set({ accessToken, refreshToken, userInfo });
            return responseData;
        } catch (error) {
            throw error;
        }
    },

    // 로그아웃 함수
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        localStorage.clear();
        set({ accessToken: null, refreshToken: null, userInfo: null });
        window.location.href = "/";
    },

    // 로그인 여부를 확인하는 함수
    isLogin: () => {
        const accessToken = localStorage.getItem("accessToken");
        return !!accessToken;
    },

    // 비번찾기-코드 전송 요청
    sendPasswordFindEmail: async ({ email }) => {
        try {
            const url = `${BASE_URL}/auth-codes/find-pwd`;
            const data = { email };
            const responseData = await post(url, data);
            const expiredTime = responseData.expiredTime
            return expiredTime; // 5
        } catch (error) {
            throw error;
        }
    },

    // 비번찾기-코드 확인 요청
    verifyAuthCode: async ({ email, authCode }) => {
        try {
            const url = `${BASE_URL}/auth-codes/verify-pwd`;
            const data = { email, authCode };
            const response = await post(url, data);
            return response; //true
        } catch (error) {
            throw error;
        }
    },

    // 비번찾기-비밀번호 변경 요청
    changePassword: async ({ email, newPassword }) => {
        try {
            const url = `${BASE_URL}/auth-codes/password`;
            const data = { email, newPassword };
            const response = await patch(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 비밀번호 변경 요청
    passwordChange: async ({ accessToken, userId, oldPassword, newPassword }) => {
        try {
            const url = `${BASE_URL}/users/${userId}/password`
            const data = { oldPassword, newPassword }
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await patch(url, data, headers)
            return response // true
        } catch (error) {
            throw error;
        }
    },

    // 회원가입-코드 전송 요청
    sendSignUpEmail: async ({ email }) => {
        try {
            const url = `${BASE_URL}/auth-codes/send-code`;
            const data = { email };
            const responseData = await post(url, data);
            const expiredTime = responseData.expiredTime
            return expiredTime; //5
        } catch (error) {
            throw error
        }
    },

    // 회원가입-코드 확인 요청
    verifySignUpCode: async ({ email, authCode }) => {
        try {
            const url = `${BASE_URL}/auth-codes/verify-code`
            const data = { email, authCode }
            const response = await post(url, data);
            return response; //true
        } catch (error) {
            throw error;
        }
    },

    // 닉네임 검사 요청
    checkNickName: async ({ nickName }) => {
        try {
            const url = `${BASE_URL}/auth/check-nickname`
            const data = { nickName }
            const response = await post(url, data);
            return response
        } catch (error) {
            throw error;
        }
    },

    // 회원가입 요청
    signUp: async ({ email, password, nickName }) => {
        try {
            const url = `${BASE_URL}/auth/signup`
            const data = { email, password, nickName }
            const response = await post(url, data);
            return response
        } catch (error) {
            throw error;
        }
    },

    //정보 불러오기
    loadUserInfo: async ({ accessToken, userId }) => {
        try {
            const url = `${BASE_URL}/users/${userId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const responseData = await get(url, {}, headers);
            localStorage.setItem("userInfo", JSON.stringify(responseData));
            console.log("정보가져옴")
            return responseData
        } catch (error) {
            throw error
        }
    },

    //정보 수정 요청
    updateUserInfo: async ({ accessToken, userId, newUserInfo }) => {
        try {
            const url = `${BASE_URL}/users/${userId}`;
            const data = newUserInfo;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            };
            const responseData = await patch(url, data, headers);
            localStorage.setItem("userInfo", JSON.stringify(responseData));
            return responseData
        } catch (error) {
            throw error
        }
    },

    // 내 코드 보기 (미완성)
    myCode: async ({ accessToken, userId }) => {
        try {
            const url = `${BASE_URL}/users/${userId}/codes`
            const data = {}
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const responseData = await get(url, data, headers);
            return responseData
        } catch (error) {
            console.log(error)
        }
    },
    //

}));
export default useAuthStore;
