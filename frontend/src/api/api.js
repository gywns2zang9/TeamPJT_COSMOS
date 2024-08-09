import axios from 'axios';
import useAuthStore from '../store/auth';

// Axios 인스턴스 설정
const api = axios.create({
    baseURL: '', // 기본 URL 설정
    timeout: 10000, // 요청 타임아웃 시간 설정
    headers: { 'Content-Type': 'application/json' }, // 기본 헤더 설정
});

// Axios 응답 인터셉터 설정
api.interceptors.response.use(
    // 성공적인 응답을 처리하는 함수
    response => {
        console.log("성공적인 응답: ", response);
        return response;
    },
    // 오류 응답을 처리하는 비동기 함수
    async (error) => {
        console.log("에러났네 토큰문제인지 확인해볼까? ", error);
        const { response } = error; // error 객체에서 response를 추출
        if (response && response.status === 401) { // 응답이 있고, 상태 코드가 401(권한 없음)일 경우
            console.log("401에러구나");
            if (response.data.error.accessToken && response.data.error.accessToken === "Expired JWT token") {
                console.log("accessToken 만료됐엉")
                try {
                    const { getRefreshToken, reissuanceAccessToken } = useAuthStore.getState();
                    const refreshToken = getRefreshToken();
                    const accessToken = await reissuanceAccessToken({ refreshToken });
                    if (accessToken) {
                        error.config.headers['Authorization'] = `Bearer ${accessToken}`; // 원래 요청의 헤더를 새로운 액세스 토큰으로 업데이트
                        console.log("accessToken 바꿔서 다시 요청")
                        return api(error.config); // 원래 요청을 다시 시도하여 새로운 액세스 토큰으로 API 요청을 재시도
                    }
                } catch (error) {
                    console.log("토큰 재발급 오류: ", error);
                    return Promise.reject(error); // 토큰 재발급 오류를 반환
                }
            } else if (response.data.error.accessToken && response.data.error.accessToken === "Unexpected error") {
                console.log("없는 토큰")
            } else if (response.data.error && response.data.error.auth) {
                console.log(response.data.error.auth)
            }
        }
        console.log("그냥 아닌가벼")
        return Promise.reject(error); // 다른 오류는 그대로 반환
    }
);

// GET 요청
export const get = async (url, params = {}, headers = {}) => {
    const response = await api.get(url, { params, headers: { ...api.defaults.headers, ...headers } });
    return response.data;
};

// POST 요청
export const post = async (url, data = {}, headers = {}) => {
    const response = await api.post(url, data, { headers: { ...api.defaults.headers, ...headers } });
    return response.data;
};

// PATCH 요청
export const patch = async (url, data = {}, headers = {}) => {
    const response = await api.patch(url, data, { headers: { ...api.defaults.headers, ...headers } });
    return response.data;
};

// DELETE 요청
export const deleteRequest = async (url, params = {}, headers = {}) => {
    const response = await api.delete(url, { params, headers: { ...api.defaults.headers, ...headers } });
    return response.data;
};
