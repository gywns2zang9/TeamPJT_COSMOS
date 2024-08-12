import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userCode.css";
import "../../css/user/userInfo.css";

const UserCode = () => {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getMyCodes = useAuthStore((state) => state.getMyCodes);
  
  const [myCodes, setMyCodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCodes = async () => {
      try {
        const accessToken = getAccessToken();
        const userInfo = getUserInfo();
        const userId = userInfo.userId;
        const codes = await getMyCodes({ accessToken, userId });
        setMyCodes(codes); // 전체 코드 정보를 저장
      } catch (error) {
        console.error("코드를 가져오는 중 오류 발생:", error);
      }
    };

    fetchMyCodes();
  }, [getAccessToken, getUserInfo, getMyCodes]);

  const handleCodeClick = (teamId, fileId) => {
    navigate(`/group/${teamId}/code/${fileId}`);
  };

  return (
    <div className="info-container">
      <div className="info-title">내 코드 모음</div>
      <div id="code-box">
        {/* 문제 목록 */}
        <div id="code-list">
          {myCodes.length > 0 ? (
            <ul>
              {myCodes.map((myCode, index) => (
                <li key={index} 
                  onClick={() => handleCodeClick(myCode.teamId, myCode.fileId)} 
                >
                  {myCode.problem}
                </li>
              ))}
            </ul>
          ) : (
            <p id="no-problem">문제가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCode;
