import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";

const KakaoRedirect = () => {
    const navigate = useNavigate();
    const kakao = useAuthStore((state) => state.kakao);
    const authorizationCode = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        const fetchKakaoUser = async () => {
            try {
                const { accessToken, refreshToken, userInfo } = await kakao({ authorizationCode });
                navigate(`/users/${userInfo.userId}`);
            } catch (error) {
                console.log("fetchKakaoUser 오류:", error.response.data.error.user);
                navigate('/login')
            }
        };

        if (authorizationCode) {
            fetchKakaoUser();
        }
    }, [authorizationCode, kakao, navigate]);

    return (
        <div>
            <h1>카카오 로그인 중입니다...</h1>
        </div>
    );
};

export default KakaoRedirect;
