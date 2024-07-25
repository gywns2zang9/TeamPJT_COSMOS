import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/group/groupSettingsModal.css';

function GroupSettingsModal({ show, handleClose, isLeader }) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [newLeader, setNewLeader] = useState('');
    const [members, setMembers] = useState([]);
    const teamCode = '12345'; // 팀 코드 서버에서 받아와

    useEffect(() => {
        // 그룹원 목록을 서버에서 받아오는 로직 추가
        // 임시 그룹원 목록 사용
        setMembers(['Member 1', 'Member 2', 'Member 3']);
    }, []);

    const handleSaveChanges = () => {
        // 저장 로직 추가
        console.log('저장된 그룹 이름:', groupName);
        console.log('저장된 그룹 소개:', groupDescription);
        console.log('새 그룹장:', newLeader);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isLeader ? '그룹 설정' : '그룹 정보'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLeader ? (
                    <Form>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>그룹 이름</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="그룹 이름을 입력하세요" 
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formGroupDescription">
                            <Form.Label>그룹 소개</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="그룹 소개를 입력하세요" 
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewLeader">
                            <Form.Label>그룹장 위임</Form.Label>
                            <Form.Control 
                                as="select"
                                value={newLeader}
                                onChange={(e) => setNewLeader(e.target.value)}
                            >
                                <option value="">그룹원을 선택하세요</option>
                                {/* 그룹원 목록 select에 추가하기 */}
                                {members.map((member, index) => (
                                    <option key={index} value={member}>{member}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formTeamCode">
                            <Form.Label>팀 코드 {teamCode}</Form.Label>
                        </Form.Group>
                    </Form>
                ) : (
                    <>
                        <Form.Group controlId="formTeamCode">
                            <Form.Label>팀 코드 {teamCode}</Form.Label>
                        </Form.Group>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {isLeader ? '그룹페이지로 돌아가기' : '닫기'}
                </Button>
                {/* 팀원이 1명도 없는 경우의 수 추가하기 */}
                {!isLeader && (
                    <Button variant="danger" onClick={() => alert('그룹을 나가시겠습니까?')}>
                        그룹 나가기
                    </Button>
                )}
                {isLeader && (
                    <Button variant="primary" onClick={handleSaveChanges}>
                        변경 내용 저장
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default GroupSettingsModal;
