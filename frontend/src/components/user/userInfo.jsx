import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userInfo.css";

import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const UserInfo = () => {
  const navigate = useNavigate();

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const logout = useAuthStore((state) => state.logout);

  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [userId, setUserId] = useState(userInfo.userId);
  const [email, setEmail] = useState(userInfo.email);
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [type, setType] = useState(userInfo.type);
  const [branch, setBranch] = useState(userInfo.branch);
  const [gitId, setGitId] = useState(userInfo.gitId);
  const [repo, setRepo] = useState(userInfo.repo);
  const [description, setDescription] = useState(userInfo.description);

  useEffect(() => {
    console.log("useEffect 실행")
    const userInfo = getUserInfo();
    setUserInfo(userInfo);
    setUserId(userInfo.userId);
    setEmail(userInfo.email);
    setNickName(userInfo.nickName);
    setType(userInfo.type);
    setGitId(userInfo.gitId);
    setRepo(userInfo.repo);
    setBranch(userInfo.branch);
    setDescription(userInfo.description);
  }, [getUserInfo, getAccessToken]);

  const toChange = () => {
    navigate(`change`);
  };

  const toCode = () => {
    navigate("code");
  };
  
  const handleGroup = () => {
    navigate("../../group")
  }

  const handleLogout = () => {
    logout();
  };


  return (
    <div id="info-container">
      <div id="info-title">내 정보</div> 
      <div id="info-box">

        <div id="info-group">

        <div id="info-email-group">
            <label id="info-email-label" htmlFor="email">
              가입 이메일:
            </label>
            {type && type === "NAVER" && <img id="icon-naver" src={naverIcon} alt="네이버 아이콘" />}
            {type && type === "KAKAO" && <img id="icon-kakao" src={kakaoIcon} alt="카카오 아이콘" />}
            <span id="info-email">{email || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
          </div>


          <div id="info-nickname-group">
            <label id="info-nickname-label" htmlFor="nickname">
              닉네임:
            </label>
            <span id="info-nickname">{nickName || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>} </span>
          </div>


          <div id="info-description-group">
            <label id="info-description-label" htmlFor="description">
              내 소개:
            </label>
            <span id="info-description">{description || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
          </div>

          <div id="info-gitId-group">
            <label id="info-gitId-label" htmlFor="gitId">
              Git Id:
            </label>
            <span id="info-gitId">{gitId || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
          </div>

          <div id="info-repo-group"> 
            <label id="info-repo-label" htmlFor="repo">
              Repository:
            </label>
            <span id="info-repo">{repo || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
          </div>

          <div id="info-branch-group"> 
            <label id="info-branch-label" htmlFor="branch">
              Branch:
            </label>
            <span id="info-branch">{branch || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
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
        <div id="info-group-btn" onClick={handleGroup}>
          내 그룹 보기
        </div>
        <div id="info-logout-btn" onClick={handleLogout}>
          로그아웃
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
