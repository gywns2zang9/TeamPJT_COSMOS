import React from "react";
import homeImg from "../assets/media/mainImg.jpeg";
import "../css/home/style.css";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function HomeView(props) {
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
          <Link to="/group" id="group-page-link">
        <img src={homeImg} alt="" id="home-img" />
        <div id="start-service">
          {/* 비로그인 사용자일 때, 로그인페이지로 이동하게 할 것 */}
            <span>서비스 시작하기</span>
        </div>
          </Link>
      </div>
    </div>
  );
}

export default HomeView;
