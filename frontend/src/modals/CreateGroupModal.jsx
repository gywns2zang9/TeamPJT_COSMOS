import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/group/style.css';

// 생성버튼에 API요청 -> 성공하면 그룹상세페이지로 이동

function CreateGroupModal({ show, handleClose }) {
    return (
        <Modal id="modal-background" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>그룹 생성</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body">
                <form>
                    <div>
                        <label htmlFor="group-name" className='mb-2'>그룹 이름</label>
                        <input type="text" placeholder="그룹 이름" className="form-control" />
                        <br />
                        <label htmlFor="group-description" className='mb-2'>그룹 소개</label>
                        <input type="text" placeholder="그룹 소개" className="form-control" />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer id="modal-footer-button">
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary">
                    생성
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateGroupModal;
