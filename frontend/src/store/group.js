import { create } from 'zustand';
import useStore from './index.js';
import { deleteRequest, get, patch, post } from '../api/api.js'

const BASE_URL = useStore.getState().BASE_URL;

// useAuthStore 에서 받아오기
const accessToken = '1234123'

const useGroupStore = create((set) => ({
    // 그룹 목록 불러오기
    loadGroupList: async ({ userId }) => {
        try {
            const url = `${BASE_URL}/users/${userId}/teams`;
            const data = {
                accessToken,
            };

            const response = await get(url, data);
            console.log(response);
            return response;
        } catch (err) {
            console.log('그룹 목록 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 생성하기
    makeGroup: async ({ userId, groupName, description }) => {
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
            console.log('그룹 생성 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 참여하기
    joinGroup: async ({ userId, teamCode }) => {
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
            console.log('그룹 참여 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 상세 정보 불러오기
    groupDetailLoad: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}`;
            const data = {
                accessToken,
            };
            const response = await get(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 상세 정보 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 멤버 목록 불러오기
    groupMemberListLoad: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/users`;
            const data = {
                accessToken,
            };
            const response = await get(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 멤버 목록 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 정보 변경 요청하기
    updateGroupInfo: async ({ groupId, groupName, description }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}`;
            const data = {
                accessToken,
                teamName: groupName,
                description
            };
            const response = await patch(url, data);
            console.log(response);
            return response

        } catch (err) {
            console.log('그룹 정보 변경 실패 -> ', err);
            throw err;
        }
    },

    // 그룹장 위임하기
    updateGroupLeader: async ({ groupId, userId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/leader`;
            const data = {
                accessToken,
                userId
            };
            const response = await patch(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹장 위임 실패 -> ', err);
            throw err;
        }
    },

    // 그룹장 확인하기
    checkGroupLeader: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/leader-check`;
            const data = {
                accessToken,
            };
            const response = await get(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹장 확인 실패-> ', err);
            throw err;
        }
    },

    // 그룹 탈퇴하기
    outGroup: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}`;
            const data = {
                accessToken,
            };
            const response = await deleteRequest(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 탈퇴 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 초대 가능한 회원 조회하기
    invitePossibleUsers: async ({ teamId, nickName }) => {
        try {
            const url = `${BASE_URL}/teams/auth/${teamId}/members`;
            const data = {
                nickName,
            };
            const response = await get(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 초대 가능한 회원 조회하기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 참여코드 확인하기
    checkInviteCode: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/auth/${groupId}/teamCode`;
            const data = {
                accessToken,
            };
            const response = await get(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 참여코드 확인하기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 참여 이메일 발송하기
    sendInviteEmail: async ({ groupId, email }) => {
        try {
            const url = `${BASE_URL}/teams/auth/${groupId}/teamCode/`;
            const data = {
                email,
            };
            const response = await post(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 참여 이메일 발송하기 실패-> ', err);
            throw err;
        }
    },

    // 그룹 내 폴더 정보 불러오기 id=0이면 최상위폴더
    loadFolderInfo: async ({ groupId, folderId}) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/folder/${folderId}`;
            const data = {
                accessToken,
            };
            const response = await get(url, data);
            console.log(response);
            const responseData = await response.json();
            return responseData
        } catch (err) {
            console.log('그룹내 폴더정보 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 폴더 생성하기
    createFolder: async ({ groupId, parentId, folderName }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/folder`;
            const data = {
                accessToken,
                parentId,
                folderName
            };
            const response = await post(url, data);
            console.log(response);
            return response

        } catch (err) {
            console.log('폴더 생성 실패 -> ', err);
            throw err;
        }
    },

    // 폴더 삭제하기
    deleteFolder: async ({ groupId, folderId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/folder/${folderId}`;
            const data = {
                accessToken,
            };
            const response = await deleteRequest(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('폴더 삭제 실패 -> ', err);
            throw err;
        }
    },

    // 캘린더 일정 목록 불러오기
    loadCalendarScheduleList: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/calendars`;
            const response = await get(url);
            console.log(response);
            return response
        } catch (err) {
            console.log('캘린더 일정 목록 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 캘린더 일정 생성하기
    createCalendarSchedule: async ({ groupId, title, memo, time }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/calendar`;
            const data = {
                accessToken,
                title,
                memo,
                time
            };
            const response = await post(url, data);
            console.log(response);
            return response

        } catch (err) {
            console.log('캘린더 일정 생성 실패 -> ', err);
            throw err
        }
    },

    // 캘린더 일정 수정하기
    updateCalendarSchedule: async ({ groupId, calendarId, title, memo, time }) => {
        try {
            const url = `${BASE_URL}/${groupId}/calendar/${calendarId}`;
            const data = {
                title,
                memo,
                time
            };
            const response = await patch(url, data);
            console.log(response);
            return response

        } catch (err) {
            console.log('캘린더 일정 수정하기 실패 -> ', err);
            throw err;
        }
    },

    // 캘린더 일정 삭제하기
    deleteCalendarSchedule: async ({ groupId, calendarId }) => {
        try {
            const url = `${BASE_URL}/${groupId}/calendar/${calendarId}`;
            const response = await deleteRequest(url);
            console.log(response);
            return response
        } catch (err) {
            console.log('캘린더 일정 삭제 실패 -> ', err);
            throw err;
        }
    },
}));

export default useGroupStore;


