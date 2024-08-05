import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userInfoChange.css"; 
import defaultImg from "../../assets/media/defaultimg.png"; 

const UserInfoChange = () => {
  const navigate = useNavigate();
  

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);
  const signOut = useAuthStore((state) => state.signOut);
  const logout = useAuthStore((state) => state.logout);
  
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [userId, setUserId] = useState(userInfo.userId);
  const [email, setEmail] = useState(userInfo.email);
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [type, setType] = useState(userInfo.type);
  const [img, setImg] = useState(userInfo.img);
  const [gitId, setGitId] = useState(userInfo.gitId);
  const [repo, setRepo] = useState(userInfo.repo);
  const [description, setDescription] = useState(userInfo.description);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUserInfo(userInfo);
    setUserId(userInfo.userId);
    setEmail(userInfo.email);
    setNickName(userInfo.nickName);
    setType(userInfo.type);
    setImg(userInfo.img);
    setGitId(userInfo.gitId);
    setRepo(userInfo.repo);
    setDescription(userInfo.description);
    const accessToken = getAccessToken()
    setAccessToken(accessToken)
    }, [getUserInfo, getAccessToken]);

    const handleNickNameInput = (event) => {
      setNickName(event.target.value);
    };
  
    const handleGitIdInput = (event) => {
      setGitId(event.target.value);
    };
  
    const handleRepoInput = (event) => {
      setRepo(event.target.value);
    };
  
    const handleDescriptionInput = (event) => {
      setDescription(event.target.value);
    };

    const handleUpdate = async () => {
      const newUserInfo = {
        nickName,
        gitId,
        repo,
        description,
      };
      try {
        const updatedUser = await updateUserInfo({ accessToken, userId, newUserInfo });
        navigate(`/users/${userId}`);
      } catch (error) {
        console.error('정보 수정에 실패했습니다.', error);
      }
    };

    const handleChangePw = () => {
      navigate('/password-change');
    };
  
    const handleSignOut = async () => {
      const userId = getUserInfo().userId
      const accessToken = getAccessToken()
      console.log("회원 탈퇴 실행");
      try {
        await signOut({ accessToken, userId });
        logout();
      } catch (error) {
        console.error("회원 탈퇴 중 오류 발생:", error);
      }
    };
    
    const handleCancel = () => {
      navigate(`/users/${userId}`); 
    };


  return (
    <div id="info-change-container">
      <div id="info-change-title">내 정보 수정</div>

      <div id="info-change-box">
        <div id="img-change-group">
          <img id="info-change-img" src={img || defaultImg} alt="profile-img" />
          <button id="change-img-btn" onClick={() => {/* Implement image change logic */}}>
            프로필 이미지 변경
          </button>
        </div>

        <div id="info-change-group">
          <div id="nickname-change-group">
            <label id="nickname-label" htmlFor="nickname">
              닉네임:
            </label>
            <input
              id="nickname-input"
              type="text"
              value={nickName}
              onChange={handleNickNameInput}
            />
          </div>

          <div id="gitId-change-group">
            <label id="gitId-label" htmlFor="gitId">
              Git Id:
            </label>
            <input
              id="gitId-input"
              type="text"
              value={gitId}
              onChange={handleGitIdInput}
            />
          </div>

          <div id="repo-change-group">
            <label id="repo-label" htmlFor="repo">
              Repository:
            </label>
            <input
              id="repo-input"
              type="text"
              value={repo}
              onChange={handleRepoInput}
            />
          </div>

          <div id="intro-change-group">
            <label id="intro-label" htmlFor="intro">
              내 소개:
            </label>
            <input
              id="intro-input"
              type="text"
              value={description}
              onChange={handleDescriptionInput}
            />
          </div>
        </div>
      </div>
          {errorMessage && <div id="infochange-fail-message">{errorMessage}</div>}

      <div id="info-change-btn-group">
        <div id="info-change-save-btn" onClick={handleUpdate}>
          변경사항 저장
        </div>
        <div id="info-change-change-pw-btn" onClick={handleChangePw}>
          비밀번호 변경
        </div>
        <div id="info-change-signout-btn" onClick={handleSignOut}>
          회원 탈퇴
        </div>
        <div id="info-change-back-btn" onClick={handleCancel}>
          뒤로가기
        </div>
      </div>
    </div>
  );
};

export default UserInfoChange;
