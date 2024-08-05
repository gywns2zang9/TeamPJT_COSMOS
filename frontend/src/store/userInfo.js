// src/store/userInfo.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        userId: null,
        email: "",
        nickName: "",
        type: "", // 가입 유형 
        img: "",
        gitId: "",
        repo: "",
        description: ""
    });

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        }
    }, []);

    return [userInfo, setUserInfo];
};


export const useNavigationHandlers = () => {
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("userInfo"))?.userId;

    const toChange = () => {
        navigate(`change`);
    };

    const toCode = () => {
        navigate("code"); // 경로를 수정하세요 아직 없음
    };

    const toLogout = () => {
        console.log("로그아웃 실행")
        // 로그아웃 시 localStorage에서 토큰과 사용자 정보 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const toSignout = async () => {
        console.log("회원 탈퇴 실행");
        const accessToken = localStorage.getItem("accessToken");

        try {
            await axios.delete(`http://localhost:8080/auth/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            //로그아웃 함수 호출
            toLogout();
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error);
        }
    };

    return { toChange, toCode, toLogout, toSignout };
};

export default useUserInfo;
