import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userCode.css";

const UserCode = () => {

  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const getUserCode = useAuthStore((state) => state.getUserCode);

  // 카테고리 정의
  const categories = {
    백준: "baekjoon",
    SWEA: "swea",
    프로그래머스: "programmers",
    기타: "etc",
  };

  const [problems, setProblems] = useState([
    { title: "임시1" },
  { title: "임시2" },
  { title: "임시3" },
  { title: "임시4" },
  { title: "임시5" },
  { title: "임시6" },
  { title: "임시7" },
  { title: "임시8" },
  { title: "임시9" },
  { title: "임시10" },
  { title: "임시11" },
  { title: "임시12" },
  { title: "임시13" },
  { title: "임시14" },
  { title: "임시15" },
  { title: "임시16" },
  { title: "임시17" },
  { title: "임시18" },
  { title: "개구리가 개굴개굴 개굴개굴 개구리가 개굴" },
  { title: "임시20" },
  { title: "임시21" }
  ]);

  // 버튼 클릭 핸들러
  const handleCategorySelect = (category) => {
    console.log(`Selected category: ${category}`);
  };

  return (
    <div id="code-container">
        <div id="code-title">내 코드</div> 
        <div id="code-box">
            {/* 필터 버튼 */}
            <div id="categories-buttons" >
                {Object.keys(categories).map((category) => (
                <button
                    key={category}
                    id="category-button"
                    onClick={() => handleCategorySelect(category)}
                >
                    {category}
                </button>
                ))}
            </div>
      </div>

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
