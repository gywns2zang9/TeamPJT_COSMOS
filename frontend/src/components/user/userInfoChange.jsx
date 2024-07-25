// src/components/user/UserInfoChange.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/user/userInfoChange.css";

const UserInfoChange = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [url, setEmail] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const toSave = () => {
    navigate("/user");
  };

  const toCancel = () => {
    navigate("/user");
  };

  const toChangePw = () => {
    navigate("/password-change");
  };

  return (
    <div id="info-change-container">
      <div id="info-change-title">내 정보 수정</div>

      <div id="info-change-box">
        <div id="img-change-group">
          <img id="info-change-img" src={profileImage} alt="profile-img" />
          <button id="change-img-btn">프로필 이미지 변경</button>
        </div>

        <div id="info-change-group">
          <div id="nickname-change-group">
            <label id="nickname-label" htmlFor="nickname">
              닉네임:
            </label>
            <input
              id="nickname-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div id="git-change-group">
            <label id="git-label" htmlFor="git">
              나의 Git:
            </label>
            <input
              id="git-input"
              type="url"
              value={url}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div id="intro-change-group">
            <label id="intro-label" htmlFor="intro">
              내 소개:
            </label>
            <input
              id="intro-input"
              type="text"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div id="info-change-btn-group">
        <div id="info-change-save-btn" onClick={toSave}>
          변경사항 저장
        </div>
        <div id="info-change-change-pw-btn" onClick={toChangePw}>
          비밀번호 변경
        </div>
        <div id="info-change-back-btn" onClick={toCancel}>
          뒤로가기
        </div>
      </div>
    </div>
  );
};

export default UserInfoChange;
