import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import "../../css/user/userCode.css";

const UserCode = () => {
  // 카테고리 정의
  const categories = {
    백준: "baekjoon",
    SWEA: "swea",
    프로그래머스: "programmers",
    기타: "etc",
  };

  // 버튼 클릭 핸들러
  const handleCategorySelect = (category) => {
    console.log(`Selected category: ${category}`);
    // 이곳에서 카테고리에 따른 API 호출 및 문제 목록 업데이트 로직을 추가합니다.
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
        {/* 문제 제목들이 여기에 나열됩니다. */}
      </div>
    </div>
  );
};

export default UserCode;
