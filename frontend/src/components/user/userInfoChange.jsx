import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userInfo.css";
import naverIcon from "../../assets/media/navericon.png";
import kakaoIcon from "../../assets/media/kakaoicon.png";

const UserInfoChange = () => {
  const navigate = useNavigate();
  
  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);
  
  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [userId, setUserId] = useState(userInfo.userId);
  const [email, setEmail] = useState(userInfo.email);
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [type, setType] = useState(userInfo.type);
  const [description, setDescription] = useState(userInfo.description);
  const [gitId, setGitId] = useState(userInfo.gitId);
  const [repo, setRepo] = useState(userInfo.repo);
  const [branch, setBranch] = useState(userInfo.img);

  useEffect(() => {
    const accessToken = getAccessToken();
    const userInfo = getUserInfo();
    setAccessToken(accessToken);
    setUserInfo(userInfo);
    setUserId(userInfo.userId);
    setEmail(userInfo.email);
    setNickName(userInfo.nickName);
    setType(userInfo.type);
    setDescription(userInfo.description);
    setGitId(userInfo.gitId);
    setRepo(userInfo.repo);
    setBranch(userInfo.branch);
  }, [getUserInfo, getAccessToken]);

    const handleUpdate = async () => {
      const nickNamePattern = /^[A-Za-z0-9가-힣]{2,10}$/;
      if (!nickName) {
        window.alert("닉네임은 필수입니다.")
        return;
      } 
      else if (!nickNamePattern.test(nickName)) {
        window.alert("닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.")
        setNickName(userInfo.nickName)
        return;
      }

      const newUserInfo = {
        nickName,
        description,
        gitId,
        repo,
        branch
      };
      try {
        await updateUserInfo({ accessToken, userId, newUserInfo });
        window.alert("정상적으로 저장되었습니다.")
        navigate(`/users/${userId}`);
      } catch (error) {
        let errorMessage
        if (error.response.data.error.auth) {
          if (error.response.data.error.auth === "nickname is incorrect.") {
            errorMessage = "사용불가능한 닉네임입니다."
          } else if (error.response.data.error.auth === "Nickname is already exist.") {
            errorMessage = "이미 사용중인 닉네임입니다."
          }
          window.alert(errorMessage || "다시 시도해주세요.")
        }
        window.alert("예기치 못한 오류가 발생했습니다.")
      }
    };
    
  return (
    <div className="info-container">
      {/* 타이틀 */}
      <div className="info-title">내 정보</div>

      <div className="info-group">
      {/* email */}
        <div className="info-box">
          <label className="info-label" htmlFor="email">
            가입 이메일:
          </label>
          <span className="info-contents">
            {type && type === "NAVER" && <img className="info-type-icon" src={naverIcon} alt="네이버 아이콘" />}
            {type && type === "KAKAO" && <img className="info-type-icon" src={kakaoIcon} alt="카카오 아이콘" />}
            {email || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}
          </span>
        </div>
        {/* nickName */}
        <div className="info-box">
          <label className="info-label" htmlFor="nickname">
            닉네임:
          </label>
          <input
            className="info-input"
            type="text"
            maxLength={10}
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        </div>
        {/* description */}
        <div className="info-box">
          <label className="info-label" htmlFor="description">
            내 소개:
          </label>
          <textarea
            id="info-textarea"
            maxLength={255}
            wrap="soft"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* gitId */}
        <div className="info-box">
          <label className="info-label" htmlFor="gitId">
            Git Id:
          </label>
          <input
            className="info-input"
            type="text"
            maxLength={255}
            value={gitId}
            onChange={(e) => setGitId(e.target.value)}
          />
        </div>
        {/* repo */}
        <div className="info-box">
          <label className="info-label" htmlFor="repo">
            Repository:
          </label>
          <input
            className="info-input"
            type="text"
            maxLength={100}
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        {/* branch */}
        <div className="info-box">
          <label className="info-label" htmlFor="branch">
            Branch:
          </label>
          <input
            className="info-input"
            type="text"
            maxLength={200}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            />
        </div>
      </div>

      <div className="info-btn-group"> 
        <div className="info-btn" onClick={handleUpdate}>
          변경사항 저장
        </div>
        <div className="info-btn" onClick={() => navigate('/password-change')}>
          비밀번호 변경
        </div>
        <div className="info-btn" onClick={() => navigate(`/users/${userId}`)}        >
          뒤로가기
        </div>
      </div>
      
    </div>
  );
};

export default UserInfoChange;
