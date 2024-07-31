// 로그인 여부를 확인하는 함수
export const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
}