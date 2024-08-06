import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/group/style.css';
import { useNavigate } from 'react-router-dom';
import useGroupStore from '../store/group';
import useAuthStore from '../store/auth';

// 참여버튼 누르면 코드 확인 api 요청 -> 코드 일치하면, 그룹페이지로 이동

function JoinGroupModal({ show, handleClose, onSuccess }) {
    // 참여 코드 보내기
    const [teamCode, setTeamCode] = useState('');
    const navigate = useNavigate();
    const joinGroup = useGroupStore(state => state.joinGroup);
    const getUserInfo = useAuthStore(state => state.getUserInfo)
    const handleTeamCodeChange = (e) => {
        setTeamCode(e.target.value);
    }

    const handleJoinGroup = async () => {
        try {
            const userId = getUserInfo().userId;
            await joinGroup({ userId, teamCode});
            onSuccess(); 
            handleClose();
        } catch (err) {
            console.error('그룹 참여 중 에러 -> ', err);
        }
    };

    return (
        <Modal id="modal-background" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>그룹 참여</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body">
                <form>
                    <div>
                        <label htmlFor="group-name">참여 코드</label>
                        <input
                            type="text"
                            className="form-control"
                            id="team-code"
                            placeholder="Enter your Code here"
                            value={teamCode}
                            onChange={handleTeamCodeChange}
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer id="modal-footer-button">
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleJoinGroup}>
                    참여
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default JoinGroupModal;
