import { create } from 'zustand';
import useStore from './index.js';
import { deleteRequest, get, patch, post } from '../api/api.js'
import useAuthStore from './auth.js'

const BASE_URL = useStore.getState().BASE_URL;
const accessToken = await useAuthStore.getState().getAccessToken();
const headers = {
    Authorization: `Bearer ${accessToken}`,
}

const useGroupStore = create((set) => ({

    // 그룹 목록 불러오기
    loadGroupList: async ({ userId }) => {
        try {
            const url = `${BASE_URL}/users/${userId}/teams`;
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
            console.log(userId, groupName, description);
            const url = `${BASE_URL}/users/${userId}/team`;
            const data = {
                teamName:groupName,
                description
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
            const url = `${BASE_URL}/users/${userId}/teams/teamCode`;
            const data = {
                teamCode,
            };
            const response = await post(url, data, headers);
            return 'success'

        } catch (err) {
            console.log('그룹 참여 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 상세 정보 불러오기
    groupDetailLoad: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}`;
            const response = await get(url, {}, headers);
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
            const response = await get(url, {}, headers);
            console.log(1)
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
                teamName: groupName,
                description
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
            const url = `${BASE_URL}/teams/${groupId}/leader`;
            const data = {
                userId
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
            const url = `${BASE_URL}/teams/${groupId}/leader`;
            const response = await get(url, {}, headers);
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
            const response = await deleteRequest(url, {}, headers);
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
        console.log(groupId);
        try {
            const url = `${BASE_URL}/teams/auth/${groupId}/teamCode`;
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
            const response = await post(url, data, headers);
            console.log(response);
            return response
        } catch (err) {
            console.log('그룹 참여 이메일 발송하기 실패-> ', err);
            throw err;
        }
    },

    // 그룹 내 폴더 정보 불러오기 id=0이면 최상위폴더
    loadFolderInfo: async ({ groupId, folderId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/folder/${folderId}`;
            const response = await get(url, {}, headers);
            return response
        } catch (err) {
            console.log('그룹내 폴더정보 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 폴더 생성하기
    createFolder: async ({ groupId, parentId, folderName }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/folders`;
            const data = {
                parentId,
                folderName
            };
            const response = await post(url, data, headers);
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
            const response = await deleteRequest(url, {}, headers);
            console.log(response);
            return response
        } catch (err) {
            console.log('폴더 삭제 실패 -> ', err);
            throw err;
        }
    },

    // 파일 생성하기
    createFile: async ({ groupId, folderId, fileName, type}) => {
        console.log(type);
        try {
            let url = ''
            if (type === 'NORMAL') {
                url = `${BASE_URL}/teams/${groupId}/file`;
            } else {
            url = `${BASE_URL}/teams/${groupId}/file/code`;
            }
            const data = {
                folderId,
                fileName,
            };
            const response = await post(url, data, headers);
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

    // 파일 불러오기
    getFile: async ({ groupId, fileId, folderId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/file/${fileId}`
            const response = await get(url, {});
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // 캘린더 일정 목록 불러오기
    loadCalendarScheduleList: async ({ groupId }) => {
        try {
            const url = `${BASE_URL}/teams/${groupId}/calendars`;
            const response = await get(url, {}, headers);
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
            const formattedTime = time.replace('T', ' ').slice(0, 16);
            const data = {
                title,
                memo,
                time: formattedTime
            };
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
            const url = `${BASE_URL}/${groupId}/calendar/${calendarId}`;
            const data = {
                title,
                memo,
                time
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
            const url = `${BASE_URL}/teams/${groupId}/calendar/${calendarId}`;
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


