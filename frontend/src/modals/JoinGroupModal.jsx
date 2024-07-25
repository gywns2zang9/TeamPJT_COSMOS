import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/group/style.css';


// 참여버튼 누르면 코드 확인 api 요청 -> 코드 일치하면, 그룹페이지로 이동

function JoinGroupModal({ show, handleClose }) {
    return (
        <Modal id="modal-background" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>그룹 참여</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body">
                <form>
                    <div>
                        <label htmlFor="group-name">참여 코드</label>
                        <input type="text" className="form-control" id="group-name" placeholder="Enter your Code here" />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer id="modal-footer-button">
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary">
                    참여
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default JoinGroupModal;
