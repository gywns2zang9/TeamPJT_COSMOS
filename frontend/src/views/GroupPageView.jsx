import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/group/style.css';
import { Card } from "react-bootstrap";
import CreateGroupModal from '../modals/CreateGroupModal.jsx';
import JoinGroupModal from '../modals/JoinGroupModal.jsx';
import useGroupStore from "../store/group.js";
import useAuthStore from "../store/auth.js";

function GroupPageView(props) {
    const { userId } = useAuthStore.getState().getUserInfo();
    const groups = useGroupStore((state) => state.groups) || [];
    const setGroups = useGroupStore((state) => state.setGroups);
    const loadGroupList = useGroupStore((state) => state.loadGroupList);

    const fetchGroups = async () => {
        try {
            const response = await loadGroupList({ userId });
            const transformedData = response.map(team => ({
                id: team.id,
                name: team.name,
                description: team.description,
            }));
            setGroups(transformedData);
        } catch (error) {
            console.error('그룹 목록 불러오기 에러:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [loadGroupList]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    const navigate = useNavigate();

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const handleShowJoinModal = () => setShowJoinModal(true);
    const handleCloseJoinModal = () => setShowJoinModal(false);

    const handleJoinSuccess = () => {
        fetchGroups();
    };

    const navigateToGroupDetail = (groupId) => {
        navigate(`/group/${groupId}/main/`);
    };

    return (
        <>
            {/* 그룹 목록 */}
            <div id="group-list">
                {groups.map(group => (
                    <Card key={group.id} onClick={() => navigateToGroupDetail(group.id)}>
                        <Card.Body>
                            <Card.Title>{group.name}</Card.Title>
                            <Card.Text>{group.description}</Card.Text>
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
            <CreateGroupModal
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
            />
            <JoinGroupModal
                show={showJoinModal}
                handleClose={handleCloseJoinModal}
                onSuccess={handleJoinSuccess} // 그룹 참여 성공 시 콜백 함수 전달
            />
        </>
    );
}

export default GroupPageView;
