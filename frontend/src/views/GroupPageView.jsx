import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom"
import '../css/group/style.css';
import { Card } from "react-bootstrap";
import CreateGroupModal from '../modals/CreateGroupModal.jsx'
import JoinGroupModal from '../modals/JoinGroupModal.jsx'
import useGroupStore from "../store/group.js";

const userId = 4
function GroupPageView(props) {
    // 그룹 목록
    const groups = useGroupStore((state) => state.groups) || [];
    const setGroups = useGroupStore((state) => state.setGroups);
    const loadGroupList = useGroupStore((state) => state.loadGroupList);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await loadGroupList( {userId} );
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
        fetchGroups();
    }, [loadGroupList]);

    // 그룹 생성, 참여 모달 
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleShowJoinModal = () => setShowJoinModal(true);
  const handleCloseJoinModal = () => setShowJoinModal(false);

    const navigateToGroupDetail = (groupId) => {
        navigate(`/group/${groupId}/0/`);
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
      <JoinGroupModal show={showJoinModal} handleClose={handleCloseJoinModal} />
    </>
  );
}

export default GroupPageView;
