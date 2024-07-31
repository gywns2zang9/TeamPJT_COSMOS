import React from "react";
import "../../css/user/userInfoChange.css";
import defaultImg from "../../assets/media/defaultimg.png";
import useUserInfoChange from "../../store/userInfoChange";

const UserInfoChange = () => {
  const {
    username,
    setUsername,
    gitId,
    setGitId,
    repo,
    setRepo,
    intro,
    setIntro,
    profileImage,
    setProfileImage,
    toSave,
    toCancel,
    toChangePw
  } = useUserInfoChange();

  return (
    <div id="info-change-container">
      <div id="info-change-title">내 정보 수정</div>

      <div id="info-change-box">
        <div id="img-change-group">
          <img id="info-change-img" src={profileImage || defaultImg} alt="profile-img" />
          <button id="change-img-btn" onClick={() => {/* Implement image change logic */}}>
            프로필 이미지 변경
          </button>
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
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div id="gitId-change-group">
            <label id="gitId-label" htmlFor="gitId">
              Git Id:
            </label>
            <input
              id="gitId-input"
              type="text"
              value={gitId}
              onChange={(event) => setGitId(event.target.value)}
            />
          </div>

          <div id="repo-change-group">
            <label id="repo-label" htmlFor="repo">
              Repository:
            </label>
            <input
              id="repo-input"
              type="text"
              value={repo}
              onChange={(event) => setRepo(event.target.value)}
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
              onChange={(event) => setIntro(event.target.value)}
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
