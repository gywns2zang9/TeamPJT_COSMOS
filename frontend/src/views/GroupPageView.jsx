import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import '../css/group/style.css';
import { Card } from "react-bootstrap";
import CreateGroupModal from '../modals/CreateGroupModal.jsx'
import JoinGroupModal from '../modals/JoinGroupModal.jsx'


// 그룹 목록 -> api 요청으로 받아올 것
const groups = [
    { id: 1, name: "A708" },
    { id: 2, name: "알고리즘 코드 챌린지" },
    { id: 3, name: "그룹그룹목록목록" },
    { id: 4, name: "그룹그룹목록목록1" },
    { id: 5, name: "그룹그룹목록목록2" },
    { id: 6, name: "그룹그룹목록목록3" },
    { id: 7, name: "그룹그룹목록목록4" },
    { id: 8, name: "그룹그룹목록목록5" },
];

function GroupPageView(props) {
    // 그룹 생성, 참여 모달 
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    const navigate = useNavigate();

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const handleShowJoinModal = () => setShowJoinModal(true);
    const handleCloseJoinModal = () => setShowJoinModal(false);

    const navigateToGroupDetail = (id) => {
        navigate(`/group/${id}/0/`);
    };

    return (
        <>
            {/* 그룹 목록 */}
            <div id="group-list">
                {groups.map(group => (
                    <Card key={group.id} onClick={() => navigateToGroupDetail(group.id)}>
                        <Card.Body>
                            <Card.Title>{group.name}</Card.Title>
                        </Card.Body>
                    </Card>
                ))}    
            </div>
            
            {/* 그룹 생성 및 참여 */}
            <div id="group-auth">
                <Card onClick={handleShowCreateModal}>
                    <Card.Body>
                            그룹 생성
                    </Card.Body>
                </Card>
                <Card onClick={handleShowJoinModal}>
                    <Card.Body>
                            그룹 참여
                    </Card.Body>
                </Card>
            </div>

            {/* 그룹 모달 컴포넌트 렌더링 */}
            <CreateGroupModal show={showCreateModal} handleClose={handleCloseCreateModal} />
            <JoinGroupModal show={showJoinModal} handleClose={handleCloseJoinModal} />
        </>
    );
}

export default GroupPageView;