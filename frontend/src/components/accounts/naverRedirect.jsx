import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";

const KakaoRedirect = () => {
    const navigate = useNavigate();
    const naver = useAuthStore((state) => state.naver);
    const authorizationCode = new URL(window.location.href).searchParams.get("code");
    const state = new URL(window.location.href).searchParams.get("state");
    useEffect(() => {
        const fetchKakaoUser = async () => {
            try {
                const { accessToken, refreshToken, userInfo } = await naver({ authorizationCode, state });
                navigate(`/users/${userInfo.userId}`);
            } catch (error) {
                console.log("fetchKakaoUser 오류:", error.response.data.error.user);
                navigate('/login')
            }
        };

        if (authorizationCode) {
            fetchKakaoUser();
        }
    }, [authorizationCode, state, naver, navigate]);

    return (
        <div>
            <h1>네이버 로그인 중입니다...</h1>
        </div>
    );
};

export default KakaoRedirect;
