import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import '../css/group/inviteGroupModal.css'

// 초대하기버튼에 API요청함수 달기

function InviteGroupModal({ show, handleClose }) {
    const [inviteMethod, setInviteMethod] = useState('email'); 
    const [groupCode, setGroupCode] = useState('ABCD-1234'); // 예시 그룹 코드

    const handleInviteMethodChange = (event) => {
        setInviteMethod(event.target.value);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>초대하기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="inviteMethod">
                        <Form.Label>초대 방법</Form.Label>
                        <Form.Check
                            type="radio"
                            id="inviteEmail"
                            label="이메일로 초대"
                            name="inviteMethod"
                            value="email"
                            checked={inviteMethod === 'email'}
                            onChange={handleInviteMethodChange}
                        />
                        <Form.Check
                            type="radio"
                            id="inviteNickname"
                            label="닉네임으로 초대"
                            name="inviteMethod"
                            value="nickname"
                            checked={inviteMethod === 'nickname'}
                            onChange={handleInviteMethodChange}
                        />
                    </Form.Group>
                    {inviteMethod === 'email' && (
                        <Form.Group controlId="emailInvite">
                            <Form.Label>이메일 주소</Form.Label>
                            <Form.Control type="email" placeholder="이메일 주소를 입력하세요" />
                        </Form.Group>
                    )}
                    {inviteMethod === 'nickname' && (
                        <Form.Group controlId="nicknameInvite">
                            <Form.Label>닉네임</Form.Label>
                            <Form.Control type="text" placeholder="닉네임을 입력하세요" />
                        </Form.Group>
                    )}
                    <Form.Group controlId="groupCode">
                        <Form.Label>그룹 코드 : {groupCode}</Form.Label>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    나가기
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    초대하기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InviteGroupModal;