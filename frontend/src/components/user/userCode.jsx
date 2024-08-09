import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userCode.css";

const UserCode = () => {

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);

  const [problems, setProblems] = useState([{ title: "임시1" },{ title: "임시1" },{ title: "임시1임시1시1임시1임시1임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },{ title: "임시1" },]);

  return (
    <div id="code-container">
      <div id="code-title">내 코드</div> 
      {/* 문제 목록 */}
      <div id="code-list">
        {problems.length > 0 ? (
          <ul>
            {problems.map((problem, index) => (
              <li key={index}>{problem.title}</li>
            ))}
          </ul>
        ) : (
          <p id="no-problem">문제가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default UserCode;