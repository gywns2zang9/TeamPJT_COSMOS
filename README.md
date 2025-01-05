`# COSMOS - 화상 회의를 이용한 코딩 스터디 최적화 프로젝트

## 목차

### 1. [프로젝트 개요](#1-프로젝트-개요)

### 2. [기술 스택](#2-기술-스택)

### 3. [아키텍처 & ERD](#3-아키텍처--erd)

### 4. [서비스 기능 소개](#4-서비스-기능-소개)

## 1. 프로젝트 개요

[COSMOS](https://i11a708.p.ssafy.io/)는 개발된 코딩 스터디 맞춤형 서비스를 제공하는 사이트입니다.

### 📅 개발 기간

| 개발기간 | 2024.07.05 ~ 2024.08.16 (6주) |
| -------- | ----------------------------- |

### 👥 팀원 소개

| 팀원   | 역할      | 개발 내용                                                                       |
| ------ | --------- | ------------------------------------------------------------------------------- |
| 김도한 | 팀장, BE  | DB설계, 화상 회의, 문제 불러오기(Baekjoon, github 크롤링) , 프로젝트 관리(Jira) |
| 정예은 | BE 리드   | DB설계, 유저 인증 기능(E-mail, 소셜), 폴더 및 페이지 관리                       |
| 곽지혁 | BE, Infra | DB설계, 인프라 구축(Proxy서버, ci/cd), 코드 실행, 그룹 및 폴더 관리, 화상 회의  |
| 정호성 | FE 리드   | 그룹관련 페이지 UI(폴더구조, 사이드바, 템플릿 제작), 코드 실행 및 저장          |
| 김효준 | FE        | 로그인, 회원가입(+소셜), 유저 관리, 그룹 초대                                   |
| 지경근 | FE        | 화상회의, 공유편집기, 채팅                                                      |

### 💡 기획 의도

다음과 같은 문제 상황들을 개선하고자 했습니다.

1. 화상회의를 진행하는 과정이 번거로워 효율적인 소통이 어려운 점.
2. 구두로 설명하기 어려운 코딩 테스트 문제의 난해함.
3. 기록 관리가 까다로워 체계적인 업무 처리가 어려운 점.

## 2. 기술 스택

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <span style="font-size:17px; font-weight:bold; text-align: right; width: 100px;">Infra</span>
  <div style="text-align: left; flex: 1; padding-left: 10px;">
    <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
    <img src="https://img.shields.io/badge/ec2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white">
    <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white">
  </div>
</div>

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <span style="font-size:17px; font-weight:bold; text-align: right; width: 100px;">BE & DB</span>
  <div style="text-align: left; flex: 1; padding-left: 10px;">
    <img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> 
    <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
    <img src="https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white">
    <img src="https://img.shields.io/badge/QueryDSL-047857?style=for-the-badge&logo=querydsl&logoColor=white">
  </div>
</div>

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <span style="font-size:17px; font-weight:bold; text-align: right; width: 100px;">FE</span>
  <div style="text-align: left; flex: 1; padding-left: 10px;">
    <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
    <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
    <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white">
    <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
  </div>
</div>

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <span style="font-size:17px; font-weight:bold; text-align: right; width: 100px;">ETC</span>
  <div style="text-align: left; flex: 1; padding-left: 10px;">
    <img src="https://img.shields.io/badge/openvidu-0D97CE?style=for-the-badge&logo=openvidu&logoColor=white">
    <img src="https://img.shields.io/badge/websocket-010101?style=for-the-badge&logo=websocket&logoColor=white">
  </div>
</div>

## 3. 아키텍처 & ERD

<img src="imgs/Architect.png" alt="img_1" style="max-width: 100%; height: auto;">
<img src="imgs/Erd.png" alt="img" style="max-width: 100%; height: auto;">

## 4. 서비스 기능 소개

1. 유저 관리 기능

   - 일반 계정(E-mail), 소셜계정(kakao, naver)를 통한 유저관리
   - 로그인, 로그아웃, 회원가입, 회원탈퇴, 프로필 수정, 비밀번호 변경 등
     <details>
     <summary>관련 화면</summary>

     <li><p>로그인 화면</p></li>
     <img src="./imgs/accounts/login.png" alt="" style="max-width: 100%; height: auto;"/>
     <P>일반 로그인, 네이버 로그인, 카카오 로그인</P>

     <li><p>회원가입 화면</p></li>
     <img src="./imgs/accounts/signup.png" alt="" style="max-width: 100%; height: auto;"/>
     <P>이메일 인증 후,  일반 회원가입, 네이버 회원가입, 카카오 회원가입</P>

     <li><p>비밀번호 찾기 화면</p></li>
     <img src=".imgs/accounts/passwordfind.png" alt="" style="max-width: 100%; height: auto;"/>
     <P>이메일 인증 후, 비밀번호 변경</P>

     <li><p>비밀번호 변경 화면</p></li>
     <img src="./imgs/accounts/passwordchange.png" alt="" style="max-width: 100%; height: auto;"/>
     <P>기존 비밀번호 입력 후, 비밀번호 변경</P>

     <li><p>유저정보 화면</p></li>
     <img src="./imgs/accounts/userinfo.png" alt="" style="max-width: 100%; height: auto;"/>
     <P>가입 정보와 이메일, 닉네임, 자기소개, Git Repo Branch 정보</P>

     <li><p>유저정보 변경 화면</p></li>
     <img src="./imgs/accounts/userinfochange.png" alt="" style="max-width: 100%; height: auto;"/>
     <P>가입 정보와 이메일, 닉네임, 자기소개, Git Repo Branch 정보 변경</P>

     </details>

2. 그룹 관련 기능
   - 그룹 초대, 참여, 탈퇴 기능(E-mail, 참여 코드)
   - 그룹 내부 일정을 관리할 수 있는 기능
   - 그룹원의 제출 여부와, 풀이를 확인할 수 있는 기능
     <details>
     <summary>관련 화면</summary>
     <img src="./readme-img/group-main.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>그룹 메인 페이지 : 일정관리 및 그룹 정보, 화상회의 시작</li>
     <img src="./readme-img/group-setting.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>그룹 설정 : 그룹 초대 코드, 그룹 정보 변경 및 탈퇴</li>
     <img src="./readme-img/group-invite.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>그룹 초대 : 이메일, 닉네임 초대</li>
     <img src="./readme-img/group-overview.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>그룹 개요 : 지금까지의 문제 풀이 목록, 스터디 생성</li>
     <img src="./readme-img/group-time-overview.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>스터디 개요 : 문제 추가 및 내 풀이 불러오기, 코드 페이지 및 문제 페이지, 스터디원의 풀이 현황</li>
     <img src="./readme-img/group-code.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>개별 코드 : 풀이 코드 확인 및 코드 실행, 코드 편집</li>
     </details>
3. 코드 관련 기능
   - 지정한 Github의 Repository에서 코드를 불러올 수 있는 기능
   - 사이트 내부에서 IDE처럼 편집을 하고 코드를 실행할 수 있는 기능
     <details>
     <summary>관련 화면</summary>
     <img src="" alt="" style="max-width: 100%; height: auto;"/>
     </details>
4. 화상회의 관련 기능
   - 내가 풀었던 코드를 불러오고 실행할 수 있는 기능
   - 코드를 공유하고 동시 편집할 수 있는 기능
   - 공유 그림판 사용 기능
   - 실시간 채팅 기능
   - 화면공유기능
   - 화상회의 기본적인 기능
     <details>
     <summary>관련 화면</summary>
     <li>공유 편집기, 공유 그림판, 화상 회의</li>
     <img src="./readme-img/conferencepage.png" alt="" style="max-width: 100%; height: auto;"/>
     <li>내 코드 페이지, 컴파일, 채팅</li>
     <img src="./readme-img/mycodepage.png" alt="" style="max-width: 100%; height: auto;"/>
     </details>

`
