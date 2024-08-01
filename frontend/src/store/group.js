import { create } from 'zustand';
import useStore from './index.js';
import { deleteRequest, get, patch, post } from '../api/api.js'
import { getAccessToken } from './auth.js'

const BASE_URL = useStore.getState().BASE_URL;

const useGroupStore = create((set) => ({
    
    // 그룹 목록 불러오기
    loadGroupList: async ({ userId }) => {
        try {
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/users/${userId}/teams`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await get(url, {}, headers);
            return response;
        } catch (err) {
            console.log('그룹 목록 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 세팅하기
    groups: [],
    setGroups: (groups) => set({ groups }),

    // 그룹 생성하기
    makeGroup: async ({ userId, groupName, description }) => {
        try {
            const accessToken = getAccessToken();
            const url = `${BASE_URL}/users/${userId}/team`;
            const data = {
                groupName,
                description
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await post(url, data, headers);
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
            const accessToken = await getAccessToken();

            const url = `${BASE_URL}/users/${userId}/teams/join/`;
            const data = {
                teamCode,
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await post(url, data, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
            console.log(response);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/users`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}`;
            const data = {
                teamName: groupName,
                description
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await patch(url, data, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/leader`;
            const data = {
                userId
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await patch(url, data, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/leader-check`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await deleteRequest(url, {}, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/auth/${groupId}/teamCode`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
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
        console.log(folderId);
        try {
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/folder/${folderId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            }
            const response = await get(url, {}, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/folder`;
            const data = {
                parentId,
                folderName
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await post(url, data, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/folder/${folderId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await deleteRequest(url, {}, headers);
            console.log(response);
            return response
        } catch (err) {
            console.log('폴더 삭제 실패 -> ', err);
            throw err;
        }
    },

    // 파일 생성하기
    createFile: async ({ groupId, folderId, fileName, file }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/pages`;
            const data = {
                folderId,
                fileName,
                file,
            };            
            const response = await post(url, data);
            console.log(response);
            return response
        } catch (err) {
            console.log('파일 생성 실패 -> ', err);
            throw err;
        }
    },

    // 파일 삭제하기
    deleteFile: async ({ groupId, fileId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/files/${fileId}`;
            const response = await deleteRequest(url, {});
            console.log(response);
            return response
        } catch (err) {
            console.log('파일 삭제 실패 -> ', err);
            throw err;
        }
    },

    // 캘린더 일정 목록 불러오기
    loadCalendarScheduleList: async ({ groupId }) => {
        try {
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/calendars`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/calendar`;
            const data = {
                title,
                memo,
                time
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            console.log(headers);
            const response = await post(url, data, headers);
            return response

        } catch (err) {
            console.log('캘린더 일정 생성 실패 -> ', err);
            throw err
        }
    },

    // 캘린더 일정 수정하기
    updateCalendarSchedule: async ({ groupId, calendarId, title, memo, time }) => {
        try {
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/${groupId}/calendar/${calendarId}`;
            const data = {
                title,
                memo,
                time
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await patch(url, data, headers);
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
            const accessToken = await getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/calendar/${calendarId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await deleteRequest(url, {}, headers);
            console.log(response);
            return response
        } catch (err) {
            console.log('캘린더 일정 삭제 실패 -> ', err);
            throw err;
        }
    },
}));

export default useGroupStore;


