import { create } from 'zustand';
import useStore from './index.js';
import { deleteRequest, get, patch, post } from '../api/api.js'
import useAuthStore from './auth.js'

const BASE_URL = useStore.getState().BASE_URL;
const useGroupStore = create((set) => ({

    // 그룹 목록 불러오기
    loadGroupList: async ({ userId }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
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
            const accessToken = useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/users/${userId}/team`;
            const data = {
                teamName: groupName,
                description
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await post(url, data, headers);
            return response
        } catch (err) {
            console.log('그룹 생성 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 참여하기
    joinGroup: async ({ userId, teamCode }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/users/${userId}/teams/teamCode`;
            const data = {
                teamCode,
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/users`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
            return response
        } catch (err) {
            console.log('그룹 멤버 목록 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 정보 변경 요청하기
    updateGroupInfo: async ({ groupId, groupName, description }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
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
            const accessToken = await useAuthStore.getState().getAccessToken();
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/leader`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await deleteRequest(url, {}, headers);
            return response
        } catch (err) {
            console.log('그룹 탈퇴 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 초대 가능한 회원 조회하기
    invitePossibleUsers: async ({ groupId, nickName }) => {
        const accessToken = await useAuthStore.getState().getAccessToken();
        try {
            const url = `${BASE_URL}/teams/auth/${groupId}/members`;
            const data = {
                nickName,
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const responseData = await post(url, data, headers);
            return responseData
        } catch (err) {
            console.log('그룹 초대 가능한 회원 조회하기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 참여코드 확인하기
    checkInviteCode: async ({ groupId }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/auth/${groupId}/teamCode`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
            return response
        } catch (err) {
            console.log('그룹 참여코드 확인하기 실패 -> ', err);
            throw err;
        }
    },

    // 그룹 참여 이메일 발송하기
    sendInviteEmail: async ({ groupId, emails }) => {
        const accessToken = await useAuthStore.getState().getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const emailArray = emails.split(',').map(email => email.trim()); //리스트에 담음
        try {
            const url = `${BASE_URL}/teams/auth/${groupId}/teamCode`;
            const data = {
                "emails": emailArray
            };
            await post(url, data, headers);
            window.alert(`${emailArray}로 발송 완료!`)
        } catch (err) {
            console.log('그룹 참여 이메일 발송하기 실패-> ', err);
            throw err;
        }
    },

    // 그룹 내 폴더 정보 불러오기 id=0이면 최상위폴더
    loadFolderInfo: async ({ groupId, folderId }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/folder/${folderId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            }
            const response = await get(url, {}, headers);
            return response
        } catch (err) {
            console.log('그룹내 폴더정보 불러오기 실패 -> ', err);
            throw err;
        }
    },

    // 스터디 생성하기
    createStudy: async ({ groupId, year, month }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/study`;
            const data = {
                year,
                month
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await post(url, data, headers);
            return response
        } catch (err) {
            console.log('스터디 생성 실패 -> ', err);
            throw err;
        }
    },

    // 문제 추가하기
    createProblem: async ({ groupId, problemNumber, studyId }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/problems`;
            const data = {
                problemNumber,
                studyId
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            console.log(url, data, headers);
            const response = await post(url, data, headers);
            console.log('문제 생성 성공');
            return response
        } catch (err) {
            console.log('문제 생성 실패 -> ', err);

        }
    },

    // 폴더 생성하기
    createFolder: async ({ groupId, parentId, folderName }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/folders`;
            const data = {
                parentId,
                folderName
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
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
            const accessToken = await useAuthStore.getState().getAccessToken();
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
    createFile: async ({ groupId, folderId, fileName, type }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const url = `${BASE_URL}/teams/${groupId}/files/${fileId}`;

            const response = await deleteRequest(url, {}, headers);
            console.log(response);
            return response
        } catch (err) {
            console.log('파일 삭제 실패 -> ', err);
            throw err;
        }
    },

    // 파일 불러오기
    getFile: async ({ groupId, fileId }) => {
        const accessToken = await useAuthStore.getState().getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        try {
            const url = `${BASE_URL}/teams/${groupId}/file/${fileId}`
            const response = await get(url, {}, headers);
            return response
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // 일반 페이지 수정하기
    updateNormalFile: async ({ groupId, fileId, name, content }) => {
        const accessToken = await useAuthStore.getState().getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        try {
            const url = `${BASE_URL}/teams/${groupId}/file/${fileId}`;
            const data = {
                name,
                content
            };
            const response = await patch(url, data, headers);
            return response
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // 코드 자동 불러오기
    loadCode: async ({ groupId, userId, problemId }) => {
        console.log(groupId, userId, problemId);
        const accessToken = await useAuthStore.getState().getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const data = {
            userId,
            problemId
        }
        try {
            const url = `${BASE_URL}/teams/${groupId}/problems/code`;
            const response = await post(url, data, headers);
            return response
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // 코드 페이지 수정하기
    updateCodeFile: async ({ groupId, fileId, name, code, content, language }) => {
        const accessToken = await useAuthStore.getState().getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        try {
            const url = `${BASE_URL}/teams/${groupId}/files/codes/${fileId}`;
            const data = {
                name,
                code,
                content,
                language
            };
            const response = await patch(url, data, headers);
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/calendars`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/calendar`;
            console.log(time);
            const formattedTime = time.replace('T', ' ').slice(0, 16);
            console.log(formattedTime);
            const data = {
                title,
                memo,
                time: formattedTime
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
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
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/calendar/${calendarId}`;
            const formattedTime = time.replace('T', ' ').slice(0, 16);
            const data = {
                title,
                memo,
                time:formattedTime
            };
            console.log(data);
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
            const accessToken = await useAuthStore.getState().getAccessToken();
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

    // 코드 실행하기 
    executeCode: async ({ content, language, input }) => {
        try {
            console.log(content, language, input);
            const accessToken = await useAuthStore.getState().getAccessToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const url = `${BASE_URL}/codes/execute`;
            const data = {
                content,
                language,
                inputs: input
            };
            console.log(data);
            const response = await post(url, data, headers);
            return response
        } catch (err) {
            console.log('코드 실행 실패 -> ', err);
            throw err;
        }
    },

    // 코드 목록 불러오기
    loadCodeList: async ({ groupId, userId }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/users/${userId}/codes`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers);
            return response
        } catch (err) {
            console.log('코드 목록 불러오기 실패 -> ', err);
            // throw err;
        }
    },

    // 개인 코드 불러오기
    loadPersonalCode: async ({ groupId, codeId }) => {
        try {
            const accessToken = await useAuthStore.getState().getAccessToken();
            const url = `${BASE_URL}/teams/${groupId}/codes/${codeId}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await get(url, {}, headers)
            return response
        } catch (err) {
            console.log('코드 불러오기 실패 -> ', err);
        }
    }
}));

export default useGroupStore;


