import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userInfoChange.css"; 

const UserInfoChange = () => {
  const navigate = useNavigate();
  

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);
  
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [userId, setUserId] = useState(userInfo.userId);
  const [email, setEmail] = useState(userInfo.email);
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [type, setType] = useState(userInfo.type);
  const [branch, setBranch] = useState(userInfo.img);
  const [gitId, setGitId] = useState(userInfo.gitId);
  const [repo, setRepo] = useState(userInfo.repo);
  const [description, setDescription] = useState(userInfo.description);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUserInfo(userInfo);
    setUserId(userInfo.userId);
    setNickName(userInfo.nickName);
    setType(userInfo.type);
    setEmail(userInfo.email);
    setDescription(userInfo.description);
    setGitId(userInfo.gitId);
    setRepo(userInfo.repo);
    setBranch(userInfo.branch)
    const accessToken = getAccessToken()
    setAccessToken(accessToken)
    }, [getUserInfo, getAccessToken]);

    const handleNickNameInput = (event) => {
      setNickName(event.target.value);
    };
    
    const handleDescriptionInput = (event) => {
      setDescription(event.target.value);
    };

    const handleGitIdInput = (event) => {
      setGitId(event.target.value);
    };
  
    const handleRepoInput = (event) => {
      setRepo(event.target.value);
    };
  
    const handleBranchInput = (event) => {
      setBranch(event.target.value);
    };

    const handleUpdate = async () => {
      const newUserInfo = {
        nickName,
        description,
        gitId,
        repo,
        branch
      };

      try {
        await updateUserInfo({ accessToken, userId, newUserInfo });
        navigate(`/users/${userId}`);
      } catch (error) {
        console.error('정보 수정에 실패했습니다.', error);
      }
    };

    const handleChangePw = () => {
      navigate('/password-change');
    };
    
    const handleCancel = () => {
      navigate(`/users/${userId}`); 
    };


  return (
    <div id="info-change-container">
      <div id="info-change-title">내 정보 수정</div>
      <div id="info-change-box">

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

          <div id="info-email-group">
            <label id="info-email-label" htmlFor="email">
              가입 이메일:
            </label>
            <span id="info-email">{email || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
          </div>

          <div id="description-change-group">
            <label id="description-label" htmlFor="description">
              내 소개:
            </label>
            <input
              id="description-input"
              type="text"
              value={description}
              onChange={handleDescriptionInput}
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

          
          <div id="branch-change-group">
            <label id="branch-label" htmlFor="branch">
              Branch:
            </label>
            <input
              id="branch-input"
              type="text"
              value={branch}
              onChange={handleBranchInput}
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
        <div id="info-change-back-btn" onClick={handleCancel}>
          뒤로가기
        </div>
      </div>
    </div>
  );
};

export default UserInfoChange;
