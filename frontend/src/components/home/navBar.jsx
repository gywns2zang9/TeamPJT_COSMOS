// #import# react
import React from "react";

// #import# bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../../css/home/navbar/style.css';

// #import# logo image
import logo from '../../assets/media/logo.jpeg';

// Main Component
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