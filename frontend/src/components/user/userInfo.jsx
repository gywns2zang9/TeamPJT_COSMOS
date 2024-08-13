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
  const loadUserInfo = useAuthStore((state) => state.loadUserInfo)
  const logout = useAuthStore((state) => state.logout);

  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [userId, setUserId] = useState(userInfo.userId);
  const [email, setEmail] = useState(userInfo.email);
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [type, setType] = useState(userInfo.type);
  const [description, setDescription] = useState(userInfo.description);
  const [gitId, setGitId] = useState(userInfo.gitId);
  const [repo, setRepo] = useState(userInfo.repo);
  const [branch, setBranch] = useState(userInfo.branch);

  useEffect(() => {
    const accessToken = getAccessToken();
    const userInfo = getUserInfo();
    const userId = userInfo.userId
    loadUserInfo({ accessToken, userId });
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
    
  }, [getAccessToken, getUserInfo, loadUserInfo]);
  

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
              {email || <span style={{ color: 'gray', fontSize: '16px' }}>정보가 없습니다.</span>}</span>
          </div>
          {/* nickName */}
          <div className="info-box">
            <label className="info-label" htmlFor="nickname">
              닉네임:
            </label>
            <span className="info-contents">{nickName} </span>
          </div>
          {/* description */}
          <div className="info-box">
            <label className="info-label" htmlFor="description">
              내 소개:
            </label>
            <span className="info-contents">{description || <span style={{ color: 'gray', fontSize: '16px' }}>내용을 추가해주세요.</span>}</span>
          </div>
          {/* gitId */}
          <div className="info-box">
            <label className="info-label" htmlFor="gitId">
              Git Id:
            </label>
            <span className="info-contents">{gitId || <span style={{ color: 'gray', fontSize: '16px' }}>내용을 추가해주세요.</span>}</span>
          </div>
          {/* repository */}
          <div className="info-box"> 
            <label className="info-label" htmlFor="repository">
              Repository:
            </label>
            <span className="info-contents">{repo || <span style={{ color: 'gray', fontSize: '16px' }}>내용을 추가해주세요.</span>}</span>
          </div>
          {/* branch */}
          <div className="info-box"> 
            <label className="info-label" htmlFor="branch">
              Branch:
            </label>
            <span className="info-contents">{branch || <span style={{ color: 'gray', fontSize: '16px' }}>내용을 추가해주세요.</span>}</span>
          </div>
        </div>

      {/* 버튼 그룹 */}
      <div className="info-btn-group"> 
        <div className="info-btn" onClick={() => navigate('change')}>
          회원정보 수정
        </div>
        <div className="info-btn" onClick={() => navigate('code')}>
          내 코드 보기
        </div>
        <div className="info-btn" onClick={() => navigate('../../group')}>
          내 그룹 보기
        </div>
        <div className="info-btn" onClick={() => logout()}>
          로그아웃
        </div>
      </div>

    </div>
  );
};

export default UserInfo;
