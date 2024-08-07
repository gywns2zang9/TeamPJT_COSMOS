import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../../css/home/navbar/style.css";
import logo from "../../assets/media/logo.jpeg";
import useAuthStore from "../../store/auth";

function NavBar() {
  const isLogin = useAuthStore((state) => state.isLogin);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const logout = useAuthStore((state) => state.logout);
  
  const login = isLogin();
  const userInfo = getUserInfo();
  const userId = userInfo ? userInfo.userId : null;

  return (
    <Navbar id="navbar">
      <Container id="navbar-container">
        <div>
          <Navbar.Brand as={Link} to="/" id="nav-brand">
            <img src={logo} alt="logo-img" id="logo-img" />
            <span id="nav-brand-name">COSMOS</span>
          </Navbar.Brand>
        </div>
        <div>
          <Nav className="me-auto" id="nav-link-container">
            {login ? (
              <>
                {/* 프로필 링크를 userId를 포함하여 동적으로 생성 */}
                <Nav.Link as={Link} to={`/group`} id="nav-group-page">
                  MY GROUP
                </Nav.Link>
                <Nav.Link as={Link} to={`/users/${userId}`} id="nav-user-profile">
                  PROFILE
                </Nav.Link>
                <Nav.Link href="#" id="nav-logout" onClick={logout}>
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
