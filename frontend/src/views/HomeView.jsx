import React from "react";
import homeImg from "../assets/media/mainImg.jpeg";
import "../css/home/style.css";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth"; 

function HomeView(props) {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 위한 함수 생성
  const isLogin = useAuthStore((state) => state.isLogin);

  // 클릭 핸들러 정의
  const handleStartServiceClick = () => {
    if (isLogin()) {
      navigate("/group"); // 로그인된 경우 /group 페이지로 이동
    } else {
      navigate("/login"); // 로그인되지 않은 경우 로그인 페이지로 이동
    }
  };

  return (
    <div id="home-card-container">
      <div id="home-description">
        <Card id="home-text">
          <h3>
            <span id="highlight-word">Co</span>ding <br />
            <span id="highlight-word">S</span>tudy <br />
            <span id="highlight-word">Mos</span>t <br />
            Useful
          </h3>
        </Card>
      </div>

      <div id="home-img-card">
        <div id="group-page-link" onClick={handleStartServiceClick}>
          <img src={homeImg} alt="home" id="home-img" />
          <div id="start-service">
            <span>서비스 시작하기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
