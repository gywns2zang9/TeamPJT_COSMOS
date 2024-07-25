import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../../css/home/navbar/style.css';
import logo from '../../assets/media/logo.jpeg';

// 로그인된 사용자면 로그아웃, 마이페이지가 보이고
// 비로그인 사용자면 로그인, 회원가입이 보이게 하기

function NavBar(props) {
    return (
        <>
            <Navbar id="navbar">
                <Container id="navbar-container">
                    <div>
                        <Navbar.Brand href="" id="nav-brand">
                            <img src={logo} alt="logo-img" id="logo-img"/>
                            <span id="nav-brand-name">COSMOS</span>
                        </Navbar.Brand>
                    </div>
                    <div>
                        <Nav className="me-auto" id="nav-link-contatiner">
                            <Nav.Link href="" id="nav-login">LOGIN</Nav.Link>
                            <Nav.Link href="" id="nav-logout">LOGOUT</Nav.Link>
                            <Nav.Link href="" id="nav-signup">SIGNUP</Nav.Link>
                        </Nav>
                    </div>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar;