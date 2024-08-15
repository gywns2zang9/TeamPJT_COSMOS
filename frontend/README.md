# COSMOS - 화상 회의를 이용한 코딩 스터디 최적화 프로젝트

## FRONTEND

## 목차

- [개요](#개요)
- [디렉토리 구조](#src-디렉토리-구조)
- [서비스 구현내용](#서비스-구현내용)
- [화면구현 및 화면설명](#화면구현-및-화면설명)
- [느낀점 및 후기](#느낀점-및-후기)
  - [호성의 느낀점 및 후기](#호성의-느낀점-및-후기)
  - [효준의 느낀점 및 후기](#효준의-느낀점-및-후기)
  - [경근의 느낀점 및 후기](#경근의-느낀점-및-후기)


## 개요
COSMOS는 개발된 코딩 스터디 맞춤형 서비스를 제공하는 사이트입니다. Front-end에서는 Node.js와 REACT, javascript, OpenVidu, tldraw를 이용해 사용자 인터페이스 디자인 및 구현, API 연동 및 UI 개발 등을 하였습니다.

## src 디렉토리 구조
```
📦src
 ┣ 📂api
 ┃ ┣ 📜api.js
 ┃ ┗ 📜apiManual.md
 ┣ 📂assets
 ┃ ┗ 📂media
 ┃ ┃ ┣ 📜chatbot.jpeg
 ┃ ┃ ┣ 📜defaultimg.png
 ┃ ┃ ┣ 📜kakaoicon.png
 ┃ ┃ ┣ 📜logo.jpeg
 ┃ ┃ ┣ 📜mainImg.jpeg
 ┃ ┃ ┣ 📜navericon.png
 ┃ ┃ ┗ 📜sample.png
 ┣ 📂components
 ┃ ┣ 📂accounts
 ┃ ┃ ┣ 📜kakaoRedirect.jsx
 ┃ ┃ ┣ 📜login.jsx
 ┃ ┃ ┣ 📜naverRedirect.jsx
 ┃ ┃ ┣ 📜passwordChange.jsx
 ┃ ┃ ┣ 📜passwordFind.jsx
 ┃ ┃ ┗ 📜signUp.jsx
 ┃ ┣ 📂conference
 ┃ ┃ ┣ 📜BasicShareCode.jsx
 ┃ ┃ ┣ 📜Code.jsx
 ┃ ┃ ┣ 📜OvVideo.jsx
 ┃ ┃ ┣ 📜Paint.jsx
 ┃ ┃ ┣ 📜ShareCode.jsx
 ┃ ┃ ┗ 📜UserVideoComponent.jsx
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜Error401.jsx
 ┃ ┃ ┣ 📜Error403.jsx
 ┃ ┃ ┗ 📜Error404.jsx
 ┃ ┣ 📂group
 ┃ ┃ ┣ 📂template
 ┃ ┃ ┃ ┣ 📜calendar.jsx
 ┃ ┃ ┃ ┣ 📜codePageTemplates.jsx
 ┃ ┃ ┃ ┣ 📜CodeWithLineNumbers.jsx
 ┃ ┃ ┃ ┣ 📜mainPageTemplates.jsx
 ┃ ┃ ┃ ┣ 📜OverviewPageTemplates.jsx
 ┃ ┃ ┃ ┗ 📜TimeOverviewTemplates.jsx
 ┃ ┃ ┣ 📜groupDetailInfo.jsx
 ┃ ┃ ┗ 📜sideBar.jsx
 ┃ ┣ 📂home
 ┃ ┃ ┣ 📜footer.jsx
 ┃ ┃ ┗ 📜navBar.jsx
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜userCode.jsx
 ┃ ┃ ┣ 📜userInfo.jsx
 ┃ ┃ ┗ 📜userInfoChange.jsx
 ┃ ┗ 📜Loading.jsx
 ┣ 📂css
 ┃ ┣ 📂accounts
 ┃ ┃ ┣ 📜accounts.css
 ┃ ┃ ┣ 📜login.css
 ┃ ┃ ┣ 📜passwordChange.css
 ┃ ┃ ┣ 📜passwordFind.css
 ┃ ┃ ┗ 📜signUp.css
 ┃ ┣ 📂conference
 ┃ ┃ ┣ 📜code.css
 ┃ ┃ ┣ 📜conference.css
 ┃ ┃ ┣ 📜paint.css
 ┃ ┃ ┗ 📜UserVideo.css
 ┃ ┣ 📂group
 ┃ ┃ ┣ 📜calendar.css
 ┃ ┃ ┣ 📜groupDetail.css
 ┃ ┃ ┣ 📜groupSettingsModal.css
 ┃ ┃ ┣ 📜inviteGroupModal.css
 ┃ ┃ ┣ 📜mainPage.css
 ┃ ┃ ┣ 📜sideBar.css
 ┃ ┃ ┗ 📜style.css
 ┃ ┣ 📂home
 ┃ ┃ ┣ 📂footer
 ┃ ┃ ┃ ┗ 📜style.css
 ┃ ┃ ┣ 📂navbar
 ┃ ┃ ┃ ┗ 📜style.css
 ┃ ┃ ┗ 📜style.css
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜userCode.css
 ┃ ┃ ┣ 📜userInfo.css
 ┃ ┃ ┗ 📜UserProfileView.css
 ┃ ┗ 📜Loading.css
 ┣ 📂modals
 ┃ ┣ 📜CalendarModal.jsx
 ┃ ┣ 📜CreateGroupModal.jsx
 ┃ ┣ 📜CreateItemModal.jsx
 ┃ ┣ 📜CreateProblemModal.jsx
 ┃ ┣ 📜CreateStudyModal.jsx
 ┃ ┣ 📜DeleteStudyModal.jsx
 ┃ ┣ 📜GroupSettingsModal.jsx
 ┃ ┣ 📜InviteGroupModal.jsx
 ┃ ┣ 📜ItemDeleteModal.jsx
 ┃ ┣ 📜JoinGroupModal.jsx
 ┃ ┣ 📜LeaveSessionModal.jsx
 ┃ ┣ 📜MyCodeListModal.jsx
 ┃ ┗ 📜StartVideoModal.jsx
 ┣ 📂routes
 ┃ ┣ 📜conferenceRoutes.js
 ┃ ┣ 📜groupRoutes.js
 ┃ ┣ 📜homeRoutes.js
 ┃ ┗ 📜userRouters.js
 ┣ 📂store
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜group.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜paint.js
 ┣ 📂views
 ┃ ┣ 📜AccountPageView.jsx
 ┃ ┣ 📜ConferenceView.jsx
 ┃ ┣ 📜GroupDetailView.jsx
 ┃ ┣ 📜GroupPageView.jsx
 ┃ ┣ 📜HomeView.jsx
 ┃ ┗ 📜UserProfileView.jsx
 ┣ 📜App.css
 ┣ 📜App.js
 ┣ 📜App.test.js
 ┣ 📜index.css
 ┣ 📜index.js
 ┣ 📜reportWebVitals.js
 ┗ 📜setupTests.js
 ```


## 서비스 구현내용
1. 일반 계정 및 소셜 계정으로 사용 가능
2. 그룹 관련 기능
    - 그룹 초대, 참여, 탈퇴 기능
    - 그룹 내부 일정을 관리할 수 있는 기능
    - 그룹원의 상태와, 풀이를 확인할 수 있는 기능
3. 코드 관련 기능
    - Github의 코드를 불러올 수 있는 기능
    - 사이트 내부에서 IDE처럼 편집을 하고 코드를 실행할 수 있는 기능
4. 화상회의 관련 기능
    - 내가 풀었던 코드를 불러오고 실행할 수 있는 기능
    - 코드를 공유하고 동시 편집할 수 있는 기능
    - 공유 그림판 사용 기능
    - 실시간 채팅 기능
    - 화면공유기능
    - 화상회의의 기본적인 기능

## 화면구현 및 화면설명


## 느낀점 및 후기
### 호성의 느낀점 및 후기
#### 1. 배운점
#### 2. 아쉬웠던 점 및 개선점

### 경근의 느낀점 및 후기
#### 1. 배운점
#### 2. 아쉬웠던 점 및 개선점

### 효준의 느낀점 및 후기
#### 1. 배운점
#### 2. 아쉬웠던 점 및 개선점