import React from "react";
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트 import
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../../css/home/navbar/style.css";
import logo from "../../assets/media/logo.jpeg";

function NavBar(props) {
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
          <Nav className="me-auto" id="nav-link-contatiner">
            <Nav.Link as={Link} to="/login" id="nav-login">
              LOGIN
            </Nav.Link>
            <Nav.Link href="" id="nav-logout">
              LOGOUT
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" id="nav-signup">
              SIGNUP
            </Nav.Link>
            {/* User Profile 페이지로 이동하는 링크 추가 */}
            <Nav.Link as={Link} to="/user" id="nav-user-profile">
              USER PROFILE
            </Nav.Link>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
