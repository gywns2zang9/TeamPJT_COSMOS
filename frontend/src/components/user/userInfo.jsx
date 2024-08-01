import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import "../../css/user/userInfo.css"; 
import defaultImg from "../../assets/media/defaultimg.png"; 
import useAuthStore from "../../store/auth";

const UserInfo = () => {
  const { getUserInfo, getAccessToken, logout, signOut } = useAuthStore();
  const [userInfo, setUserInfo] = useState(getUserInfo() || {});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = getUserInfo();
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, [getUserInfo]);

  const toChange = () => {
    navigate(`change`);
  };

  const toCode = () => {
    navigate("code"); // 경로를 수정하세요 아직 없음
  };

  const handleLogout = () => {
    console.log("로그아웃 실행");
    logout(); // 로그아웃 함수 호출
  };

  const handleSignOut = async () => {
    console.log("회원 탈퇴 실행");
    const accessToken = getAccessToken();
    const userId = userInfo.userId;

    try {
      await signOut({ accessToken, userId });
      handleLogout();
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
    }
  };

  return (
    <div id="info-container">
      <div id="info-title">내 정보</div> 
      <div id="info-box">
        <div id="info-img-group">
          <img id="info-img" src={userInfo.img || defaultImg} alt="profile-img" />
        </div>

        <div id="info-group">
          <div id="info-nickname-group">
            <label id="info-nickname-label" htmlFor="nickname">
              닉네임:
            </label>
            <span id="info-nickname">{userInfo.nickName || "정보가 없습니다."}</span>
          </div>

          <div id="info-gitId-group">
            <label id="info-gitId-label" htmlFor="gitId">
              Git Id:
            </label>
            <span id="info-gitId">{userInfo.gitId || "정보가 없습니다."}</span>
          </div>

          <div id="info-repo-group"> 
            <label id="info-repo-label" htmlFor="repo">
              Repository:
            </label>
            <span id="info-repo">{userInfo.repo || "정보가 없습니다."}</span> 
          </div>

          <div id="info-description-group">
            <label id="info-description-label" htmlFor="description">
              내 소개:
            </label>
            <span id="info-description">{userInfo.description || "정보가 없습니다."}</span>
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div id="info-btn-group"> 
        <div id="info-change-btn" onClick={toChange}>
          회원정보 수정
        </div>
        <div id="info-code-btn" onClick={toCode}>
          내 코드 보기
        </div>
        <div id="info-logout-btn" onClick={handleLogout}>
          로그아웃
        </div>
        <div id="info-signout-btn" onClick={handleSignOut}>
          회원 탈퇴
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
