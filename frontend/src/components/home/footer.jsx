import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/home/footer/style.css';
import logo from '../../assets/media/logo.jpeg';

// 개인정보처리방침, 이용약관 페이지, Contact Us 만들어서 링크 걸기

function Footer(props) {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-left mb-3 mb-md-0">
                        <img src={logo} alt="Cosmos Logo" className="footer-logo mr-2" />
                        <span>Cosmos | 개인정보처리방침 | 이용약관 | Contact Us</span>
                    </div>
                    <div className="col-md-6 text-center text-md-right">
                        <span>© COSMOS. ALL RIGHTS RESERVED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
