// src/components/user/userInfo.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/user/userInfo.css";
import defaultImg from "../../assets/media/defaultimg.png";

const UserInfo = () => {
  const navigate = useNavigate();

  const toChange = () => {
    navigate("/userinfochange");
  };

  const toCode = () => {
    navigate("");
  };

  const toLogout = () => {
    navigate("");
  };

  const toSignuout = () => {
    navigate("");
  };

  return (
    <div id="info-container">
      <div id="info-title">내 정보</div>
      <div id="info-box">
        <div id="img-group">
          <img id="info-img" src={defaultImg} alt="profile-img" />
        </div>

        <div id="info-group">
          <div id="nickname-group">
            <label id="nickname-label" htmlFor="nickname">
              닉네임:
            </label>
            <span id="user-nickname">효준이짱구</span>
          </div>

          <div id="git-group">
            <label id="git-label" htmlFor="git">
              나의 Git:
            </label>
            <span id="user-git">https://github.com/username</span>
          </div>

          <div id="intro-group">
            <label id="intro-label" htmlFor="intro">
              내 소개:
            </label>
            <span id="user-intro">반갑습니다 FE 꿈나무입니다</span>
          </div>
        </div>
      </div>

      <div id="info-btn-group">
        <div id="info-change-btn" onClick={toChange}>
          회원정보 수정
        </div>
        <div id="info-code-btn" onClick={toCode}>
          내 코드 보기
        </div>
        <div id="info-logout-btn" onClick={toLogout}>
          로그아웃
        </div>
        <div id="info-signout-btn" onClick={toSignuout}>
          회원 탈퇴
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
