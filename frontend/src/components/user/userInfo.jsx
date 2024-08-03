import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userInfo.css"; 
import defaultImg from "../../assets/media/defaultimg.png"; 

const UserInfo = () => {
  const navigate = useNavigate();

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const accessToken = useAuthStore((state) => state.getAccessToken);

  // getUserInfo 함수 호출하여 사용자 정보를 가져옴
  const userInfo = getUserInfo();

  const [userId, setUserId] = useState(userInfo.userId);
  const [email, setEmail] = useState(userInfo.email);
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [type, setType] = useState(userInfo.type);
  const [img, setImg] = useState(userInfo.img);
  const [gitId, setGitId] = useState(userInfo.gitId);
  const [repo, setRepo] = useState(userInfo.repo);
  const [description, setDescription] = useState(userInfo.description);

  const signOut = useAuthStore((state) => state.signOut);
  const logout = useAuthStore((state) => state.logout);

  const toChange = () => {
    navigate(`change`);
  };

  const toCode = () => {
    navigate("code"); // 경로를 수정하세요 아직 없음
  };

  const handleLogout = () => {
    logout();
  };

  const handleSignOut = async () => {
    console.log("회원 탈퇴 실행");
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
          <img id="info-img" src={img || defaultImg} alt="profile-img" />
        </div>

        <div id="info-group">
          <div id="info-nickname-group">
            <label id="info-nickname-label" htmlFor="nickname">
              닉네임:
            </label>
            <span id="info-nickname">{nickName || "정보가 없습니다."}   (<span>{type}</span>)</span>
          </div>

          <div id="info-gitId-group">
            <label id="info-gitId-label" htmlFor="gitId">
              Git Id:
            </label>
            <span id="info-gitId">{gitId || "정보가 없습니다."}</span>
          </div>

          <div id="info-repo-group"> 
            <label id="info-repo-label" htmlFor="repo">
              Repository:
            </label>
            <span id="info-repo">{repo || "정보가 없습니다."}</span> 
          </div>

          <div id="info-description-group">
            <label id="info-description-label" htmlFor="description">
              내 소개:
            </label>
            <span id="info-description">{description || "정보가 없습니다."}</span>
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
