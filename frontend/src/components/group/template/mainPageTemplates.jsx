// src/components/group/mainPageTemplates.jsx
import React, { useState, useEffect } from "react";
import Calendar from "./calendar.jsx";
import styled from "styled-components";
import useGroupStore from "../../../store/group.js";

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

    if (loading) {
        return <GroupInfoText>Loading........</GroupInfoText>
    }

    if (error) {
        return <GroupInfoText>Error........<br/>{error.message}</GroupInfoText>
    }

    return (
        <>
            <div>
            {groupInfo && (
                    <GroupInfoText>
                        <span>그룹 : {groupInfo.name}</span>
                        <br />
                        <span>그룹원 : {groupInfo.members.map(member => member.nickName).join(", ")}</span>
                        <br />
                        <span>그룹 소개 : {groupInfo.description}</span>
                    </GroupInfoText>
                )}
                <Calendar groupId={groupId} />
            </div>
        </>
    );
};

export default MainPageTemplates;
