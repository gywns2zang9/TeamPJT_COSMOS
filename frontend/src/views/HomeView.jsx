import React from "react";
import "../css/home/homeviewstyle.css";
import homeImg from "../assets/media/mainImg.png";

import Card from "react-bootstrap/Card";

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
        <img src={homeImg} alt="" id="home-img" />
        <div id="start-service">
          <span>서비스 시작하기</span>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
