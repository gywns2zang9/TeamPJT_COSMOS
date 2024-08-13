import React, { useState, useEffect } from "react";
import Calendar from "./calendar.jsx";
import styled from "styled-components";
import useGroupStore from "../../../store/group.js";
import '../../../css/group/mainPage.css'
import StartVideoModal from "../../../modals/StartVideoModal.jsx";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

const GroupInfoText = styled.div`
    color: white;
    font-size: 30px;
    margin: 20px;
`;

const MainPageTemplates = ({ groupId }) => {
    const { groupDetailLoad } = useGroupStore();
    const [groupInfo, setGroupInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmVideoStart, setShowConfirmVideoStart] = useState(false); 
    const navigate = useNavigate(); 
    
    const fetchGroupDetails = async () => {
        try {
            setLoading(true);
            const response = await groupDetailLoad({ groupId });
            setGroupInfo(response);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId, groupDetailLoad]);

    const handleStartVideo = () => {
        navigate(`/conference/${groupId}`);
        setShowConfirmVideoStart(false);
    }

    if (loading) {
        return <GroupInfoText className="loading-text" >Loading........</GroupInfoText>
    }

    if (error) {
        return <GroupInfoText className="error-text" >Error........<br/>{error.message}</GroupInfoText>
    }

    return (
        <>
        <div className="group-info-container">
            {groupInfo && (
                <Card style={{ width: '100%', margin: '20px auto', background:'inherit', color:'white' }}>
                    <Card.Body>
                        <Card.Title style={{ fontSize: '36px' }}>
                            <span style={{ color: '#2F95DC' }}>
                                <strong>{groupInfo.name}</strong>
                            </span> 
                        </Card.Title>
                        <Card.Text style={{ fontSize: '24px' }}>
                            멤버 : {groupInfo.members.map(member => member.nickName).join(", ")}
                        </Card.Text>
                        <Card.Text style={{ fontSize: '20px' }}>
                            {groupInfo.description}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <div className="start-conference" onClick={() => setShowConfirmVideoStart(true)} >
                <span>화상회의<br/>시작하기</span>
            </div>
        </div>
        
        <div style={{margin:'15px'}}>
            <Calendar groupId={groupId} />
        </div>

        <StartVideoModal
        show={showConfirmVideoStart}
        handleClose={() => setShowConfirmVideoStart(false)}
        handleStartVideo={handleStartVideo}
        />
        
        </>
    );
};

export default MainPageTemplates;
