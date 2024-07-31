import React from "react";
import { Route, Routes } from "react-router-dom";
import UserProfileView from "../views/UserProfileView";
import UserInfoChange from "../components/user/userInfoChange";
import PasswordChange from "../components/accounts/passwordChange";

const UserRouters = () => {
    return (
        <Routes>
            {/* 유저 프로필 페이지 */}
            <Route path=":userId" element={<UserProfileView />} />
            {/* 사용자 정보 수정 페이지 */}
            <Route path=":userId/change" element={<UserInfoChange />} />
            {/* 비밀번호 변경 페이지 */}
            <Route path=":userId/change/password" element={<PasswordChange />} />
        </Routes>
    );
};

export default UserRouters;
