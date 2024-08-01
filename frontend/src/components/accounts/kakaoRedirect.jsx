import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";

const KakaoRedirect = () => {
    const navigate = useNavigate();
    const kakaoLogin = useAuthStore((state) => state.kakaoLogin); // kakaoLogin 메소드 불러오기
    const code = new URL(window.location.href).searchParams.get("code");
    console.log("Authorization code:", code);

    useEffect(() => {
        const fetchKakaoToken = async () => {
            try {
                const { accessToken, refreshToken, userInfo } = await kakaoLogin(code);
                console.log("카카오 로그인 성공:", { accessToken, refreshToken, userInfo });

                // 로컬 스토리지에 토큰 및 사용자 정보 저장
                localStorage.setItem("accessToken", accessToken);
                console.log(1);
                localStorage.setItem("refreshToken", refreshToken);
                console.log(2);
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                console.log(3);

                // 로그인 성공 후 페이지 리다이렉션
                navigate(`/users/${userInfo.userId}`);
                console.log(4);
            } catch (error) {
                console.error("카카오 토큰 요청 실패:", error);
                alert("카카오 로그인에 실패했습니다.");
            }
        };

        if (code) {
            fetchKakaoToken();
        }
    }, [code, kakaoLogin, navigate]);

    return <div>로그인 중입니다...</div>;
}

export default KakaoRedirect;
