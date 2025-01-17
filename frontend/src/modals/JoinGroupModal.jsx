import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/group/style.css';
import { useNavigate } from 'react-router-dom';
import useGroupStore from '../store/group';
import useAuthStore from '../store/auth';

function JoinGroupModal({ show, handleClose, onSuccess }) {
    // 참여 코드 보내기
    const [teamCode, setTeamCode] = useState('');
    const navigate = useNavigate();
    const joinGroup = useGroupStore(state => state.joinGroup);
    const getUserInfo = useAuthStore(state => state.getUserInfo)
    const handleTeamCodeChange = (e) => {
        setTeamCode(e.target.value);
    }

    useEffect(() => {
        if (show) {
        setTeamCode("");
        }
    }, [show]);

    const handleJoinGroup = async () => {
        if (!teamCode) {
            window.alert("참여 코드를 입력하세요.")
            return;
        }
        try {
            const userId = getUserInfo().userId;
            await joinGroup({ userId, teamCode});
            onSuccess(); 
            handleClose();
        } catch (err) {
            let errorMessage;
            if (err.response.data.error.team && err.response.data.error.team === "This Team is not exist") {
                errorMessage = "존재하지 않는 팀 코드입니다."
            }
            window.alert(errorMessage || "예기치 못한 오류입니다.")
            setTeamCode("")
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
                            maxLength={10}
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
