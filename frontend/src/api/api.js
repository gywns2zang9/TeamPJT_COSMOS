import axios from 'axios';

// 그룹페이지로 요청보낼때, group -> team 으로 바꿔서 요청보낼것 

// Axios 인스턴스 설정
const api = axios.create({
    baseURL: '',
    timeout: 3000,
    headers: { 'Content-Type': 'application/json' },
});

// GET 요청
export const get = async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
};

// POST 요청
export const post = async (url, data = {}) => {
    const response = await api.post(url, data);
    return response.data;
};

// PATCH 요청
export const patch = async (url, data = {}) => {
    const response = await api.patch(url, data);
    return response.data;
};

// DELETE 요청
export const deleteRequest = async (url, params = {}) => {
    const response = await api.delete(url, { params });
    return response.data;
};


