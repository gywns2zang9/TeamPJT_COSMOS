import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/group/groupSettingsModal.css';
import useGroupStore from '../store/group';
import { useNavigate } from 'react-router-dom';
function GroupSettingsModal({ show, handleClose, groupId }) {
    const navigate = useNavigate();
    const [isLeader, setIsLeader] = useState(false);
    
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [newLeader, setNewLeader] = useState('');
    const [members, setMembers] = useState([]);
    const [teamCode, setTeamCode] = useState('');

    const groupDetailLoad = useGroupStore((state) => state.groupDetailLoad);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);
    const updateGroupInfo = useGroupStore((state) => state.updateGroupInfo);
    const updateGroupLeader = useGroupStore((state) => state.updateGroupLeader);
    const checkInviteCode = useGroupStore((state) => state.checkInviteCode);
    const outGroup = useGroupStore((state) => state.outGroup);
    const checkGroupLeader = useGroupStore((state) => state.checkGroupLeader);

    // 그룹 정보 받기
    useEffect(() => {
        if (show && groupId) {
            const loadGroupDetails = async () => {
                try {
                    // 그룹 정보 로드
                    const {name, description } = await groupDetailLoad({ groupId });
                    setGroupName(name);
                    setGroupDescription(description);
                    
                    // 멤버 목록 로드
                    const memberList = await groupMemberListLoad({ groupId });
                    setMembers(memberList);

                    // 초대 코드 체크
                    const inviteCode = await checkInviteCode({ groupId });
                    setTeamCode(inviteCode.teamCode);
                    
                    // 그룹장 여부 확인
                    const leaderResponse = await checkGroupLeader({ groupId });
                    setIsLeader(leaderResponse); 
                } catch (err) {
                    console.error('그룹 정보 로드 실패 -> ', err);
                }
            };

            loadGroupDetails();
        }
        console.log(teamCode);
    }, [show, groupId, groupDetailLoad, groupMemberListLoad, checkInviteCode, checkGroupLeader]);

    
    // 그룹 정보 변경
    const handleSaveChanges = async () => {
        try {
            if (isLeader) {
                await updateGroupInfo({ groupId, groupName, description:groupDescription });
                if (newLeader) {
                    await updateGroupLeader({ groupId, userId: newLeader });
                }
            }
            handleClose();
        } catch (err) {
            console.error('변경 내용 저장 실패 -> ', err);
        }
    };

    // 그룹 탈퇴
    const handleLeaveGroup = async () => {
        try {
            await outGroup({ groupId });
            navigate('/group')
            handleClose();
        } catch (err) {
            console.error('그룹 탈퇴 실패 -> ', err);
        }
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
                                placeholder={groupName} 
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formGroupDescription">
                            <Form.Label>그룹 소개</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder={groupDescription}
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
                                {members.map((member) => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
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
                    {isLeader ? '그룹 페이지로 돌아가기' : '닫기'}
                </Button>
                {!isLeader && (
                    <>
                        <Button
                            variant="danger"
                            onClick={() => {
                                if (window.confirm('정말로 그룹을 나가시겠습니까?')) {
                                    handleLeaveGroup();
                                }
                            }}
                        >
                            그룹 나가기
                        </Button>
                    </>
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
