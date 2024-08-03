import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useUserInfoChange = () => { // 사용자 정보 변경을 위한 커스텀 훅을 정의합니다.
    const [username, setUsername] = useState("");
    const [gitId, setGitId] = useState("");
    const [repo, setRepo] = useState("");
    const [intro, setIntro] = useState("");
    const [profileImage, setProfileImage] = useState("");

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅을 사용합니다.

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUserInfo) {
            setUsername(storedUserInfo.nickName || "");
            setGitId(storedUserInfo.gitId || "");
            setRepo(storedUserInfo.repo || "");
            setIntro(storedUserInfo.description || "");
            setProfileImage(storedUserInfo.img || "");
        }
    }, []); // 빈 배열을 의존성으로 두어 컴포넌트가 처음 마운트될 때만 실행됩니다.

    const toSave = async () => {
        const accessToken = localStorage.getItem("accessToken"); // localStorage에서 accessToken을 가져옵니다.
        const userId = JSON.parse(localStorage.getItem("userInfo")).userId; // localStorage에서 userId를 가져옵니다.

        const updatedUserInfo = { // 서버에 보낼 업데이트된 사용자 정보 객체를 생성합니다.
            nickName: username, // 업데이트할 사용자 닉네임
            img: profileImage, // 업데이트할 프로필 이미지
            gitId: gitId, // 업데이트할 Git ID
            repo: repo, // 업데이트할 Repository
            description: intro // 업데이트할 자기소개
        };
        console.log(updatedUserInfo)
        try {
            const response = await axios.patch( // 서버에 PATCH 요청을 보냅니다.
                `http://localhost:8080/users/${userId}`, // 요청할 API URL
                updatedUserInfo,
                {
                    headers: { // 요청 헤더 설정
                        Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
                        "Content-Type": "application/json" // 요청 본문이 JSON 형식임을 명시
                    }
                }
            );

            if (response.status === 200) {
                const updatedUser = response.data; // 서버에서 반환한 최신 사용자 정보
                localStorage.setItem("userInfo", JSON.stringify(updatedUser)); // 최신 사용자 정보를 localStorage에 저장
                navigate(`/users/${userId}`); // 사용자 정보 페이지로 이동
            }
            else { // else: 서버가 성공적으로 요청을 처리하지 않았을 때의 처리를 위한 블록입니다.
                console.error("변경사항 저장 실패");
            }
        } catch (error) { // catch: 요청 과정에서 오류가 발생했을 때의 처리를 위한 블록입니다.
            console.error("변경사항 저장 실패", error);
        }
    };

    const toCancel = () => { // 변경사항 저장 없이 뒤로 가는 함수입니다.
        navigate("/user"); // 사용자 정보 페이지로 이동합니다.
    };

    const toChangePw = () => { // 비밀번호 변경 페이지로 이동하는 함수입니다.
        navigate("/password-change"); // 비밀번호 변경 페이지로 이동합니다.
    };

    return { // 훅에서 반환하는 객체로 컴포넌트에서 사용할 상태와 핸들러를 제공합니다.
        username,
        setUsername,
        gitId,
        setGitId,
        repo,
        setRepo,
        intro,
        setIntro,
        profileImage,
        setProfileImage,
        toSave,
        toCancel,
        toChangePw
    };
};

export default useUserInfoChange; // 커스텀 훅을 기본 내보내기로 설정합니다.
