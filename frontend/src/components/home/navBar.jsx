import React from "react";
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트 import
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../../css/home/navbar/style.css";
import logo from "../../assets/media/logo.jpeg";

function NavBar() {
  // localStorage에서 accessToken과 userInfo를 가져와 로그인 상태 확인 및 userId 추출
  const accessToken = localStorage.getItem("accessToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo ? userInfo.userId : null;

  const handleLogout = () => {
    // 로그아웃 시 localStorage에서 토큰과 사용자 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/"; // 홈으로 리다이렉트
  };

  return (
    <Navbar id="navbar">
      <Container id="navbar-container">
        <div>
          {/* Navbar.Brand를 Link로 감싸서 홈으로 이동하도록 설정 */}
          <Navbar.Brand as={Link} to="/" id="nav-brand">
            <img src={logo} alt="logo-img" id="logo-img" />
            <span id="nav-brand-name">COSMOS</span>
          </Navbar.Brand>
        </div>
        <div>
          <Nav className="me-auto" id="nav-link-container">
            {accessToken ? (
              <>
                {/* 프로필 링크를 userId를 포함하여 동적으로 생성 */}
                <Nav.Link as={Link} to={`/users/${userId}`} id="nav-user-profile">
                  PROFILE
                </Nav.Link>
                <Nav.Link href="#" id="nav-logout" onClick={handleLogout}>
                  LOGOUT
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" id="nav-login">
                  LOGIN
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" id="nav-signup">
                  SIGNUP
                </Nav.Link>
              </>
            )}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
