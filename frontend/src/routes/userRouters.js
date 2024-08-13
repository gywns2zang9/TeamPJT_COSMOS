import React from "react";
import { Route, Routes } from "react-router-dom";
import UserProfileView from "../views/UserProfileView";
import UserInfoChange from "../components/user/userInfoChange";
import UserCode from "../components/user/userCode";
import Error404 from "../components/error/Error404";

const UserRouters = () => {
    return (
        <Routes>
            {/* 유저 프로필 페이지 */}
            <Route path=":userId" element={<UserProfileView />} />
            {/* 사용자 정보 수정 페이지 */}
            <Route path=":userId/change" element={<UserInfoChange />} />
            {/* 유저 코드 페이지 */}
            <Route path=":userId/Code" element={<UserCode />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};

export default UserRouters;
