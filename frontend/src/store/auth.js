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

    // 사용자 정보를 가져오는 함수
    getUserInfo: () => {
        return JSON.parse(localStorage.getItem("userInfo"));
    },

    // 일반 로그인 요청
    login: async ({ email, password }) => {
        console.log(email, password);

        try {
            const url = `${BASE_URL}/auth/login`;
            const data = { email, password };
            const responseData = await post(url, data);
            const { accessToken, refreshToken, userInfo } = responseData;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            // 상태 업데이트
            set({ accessToken, refreshToken, userInfo });

            console.log(`로그인 요청 성공! -> ${userInfo.nickName}님, 환영합니다!`);
            return { accessToken, refreshToken, userInfo };

        } catch (error) {
            console.log("로그인 요청 실패! ->", error);
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

            console.log(`카카오 로그인 요청 성공! -> ${userInfo.nickName}님, 환영합니다!`);
            return { accessToken, refreshToken, userInfo };

        } catch (error) {
            console.log("카카오 로그인 요청 실패! ->", error);
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

            console.log(`네이버 로그인 성공! -> ${userInfo.nickName}님, 환영합니다!`);
            return { accessToken, refreshToken, userInfo };

        } catch (error) {
            console.log("네아버 로그인 실패! ->", error);
            throw error;
        }
    },

    // 로그아웃 함수
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        set({ accessToken: null, refreshToken: null, userInfo: null });

        // 홈 페이지로 리다이렉트
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
            console.log(`비번찾기-코드 전송 요청 성공! -> ${email}로 코드를 발송했습니다.`)
            return expiredTime;

        } catch (error) {
            console.log("비번찾기-코드 전송 요청 실패! ->", error);
            throw error;
        }
    },

    // 비번찾기-코드 확인 요청
    verifyAuthCode: async ({ email, authCode }) => {
        try {
            const url = `${BASE_URL}/auth-codes/verify-pwd`;
            const data = { email, authCode };
            const response = await post(url, data);
            return response;

        } catch (error) {
            console.log("비번찾기-코드 확인 요청 실패! ->", error);
            throw error;
        }
    },

    // 비밀번호 변경 요청
    changePassword: async ({ email, newPassword }) => {
        try {
            const url = `${BASE_URL}/auth-codes/password`;
            const data = { email, newPassword };
            const response = await patch(url, data);
            return response;

        } catch (error) {
            console.error("비밀번호 변경 요청 실패! ->", error);
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
            console.log(`회원가입-코드 전송 요청 성공! -> ${email}로 코드를 발송했습니다.`)
            return expiredTime;
        } catch (error) {
            console.log("회원가입-코드 전송 요청 실패!", error);
            throw error
        }
    },

    // 회원가입-코드 확인 요청
    verifySignUpCode: async ({ email, authCode }) => {
        try {
            const url = `${BASE_URL}/auth-codes/verify-code`
            const data = { email, authCode }
            const response = await post(url, data);
            return response;
        } catch (error) {
            console.log("회원가입-코드 확인 요청 실패!", error);
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
            console.log("닉네임 검사 요청 실패! ->", error);
            throw error;
        }
    },

    // 회원가입 요청
    signUp: async ({ email, password, nickName }) => {
        try {
            const url = `${BASE_URL}/auth/signup`
            const data = { email, password, nickName }
            const response = await post(url, data);
            console.log(`회원가입 성공! ${nickName}님 감사합니다.`)
            return response

        } catch (error) {
            console.log("회원가입 요청 ->", error);
            throw error;
        }
    },

    // 회원탈퇴 요청
    signOut: async ({ accessToken, userId }) => {
        try {
            const url = `${BASE_URL}/auth/users/${userId}`
            const headers = {
                Authorization: `Bearer ${accessToken}`
            }
            const response = await deleteRequest(url, {}, headers);
            console.log(`회원탈퇴 성공! 안녕히가세요.`)
            return response

        } catch (error) {
            console.log("회원탈퇴 요청 실패! ->", error);
            throw error;
        }
    }


}));
export default useAuthStore;
