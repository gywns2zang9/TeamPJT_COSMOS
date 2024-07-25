import React from "react";
import UserInfo from "../components/user/userInfo";
import "../css/user/UserProfileView.css"; // 올바른 경로로 CSS 파일 불러오기

// UserProfileView 컴포넌트 정의
const UserProfileView = () => {
  return (
    <div id="user-profile-view">
      <UserInfo /> {/* UserInfo 컴포넌트를 렌더링 */}
    </div>
  );
};

export default UserProfileView;
