import { create } from 'zustand';
import useStore from './index.js';
import { get, post } from '../api/api.js'

const BASE_URL = useStore.getState().BASE_URL;

const useGroupStore = create((set) => ({
    // 그룹 목록 불러오기
    loadGroupList: async ({ accessToken }) => {
        try {
            const url = `${BASE_URL}/users/{userId}/teams`;
            const data = {
                accessToken,
            };

            const response = await get(url, data);
            console.log(response);
            return response;
        } catch (err) {
            console.log('그룹 목록 불러오기 실패 -> ',err);
            throw err;
        }
    },

    // 그룹 생성하기
    makeGroup: async ({ userId, accessToken, groupName, description }) => {
        try {
            const url = `${BASE_URL}/users/${userId}/teams`;
            const data = {
                accessToken,
                teamName: groupName,
                description
            };

            const response = await post(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 생성 실패 -> ',err);
            throw err;
        }
    },

    // 그룹 참여하기
    joinGroup: async ({ accessToken, userId, teamCode }) => {
        try {
            const url = `${BASE_URL}/users/${userId}/teams/join/`;
            const data = {
                accessToken,
                teamCode,
            };
            const response = await post(url, data);
            console.log(response);
            return response
            
        } catch (err) {
            console.log('그룹 참여 실패 -> ',err);
            throw err;
        }
    },
}));

export default useGroupStore;
