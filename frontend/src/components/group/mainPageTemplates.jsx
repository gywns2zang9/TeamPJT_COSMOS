import React from 'react';
import Calendar from './calendar.jsx';
import styled from 'styled-components';

const GroupInfoText = styled.div`
    color: white;
    font-size: 30px;
    margin: 20px;
`;

// 그룹 정보 받아와서 적기 API

const MainPageTemplates = ({ pageId, groupId }) => {
    return (
        <>
            <div>
                <GroupInfoText>
                    <span>그룹 : A708</span>
                    <br />
                    <span>그룹원 : 곽지혁, 김도한, 김효준, 지경근, 정예은, 정호성</span>
                    <br />
                    <span>그룹 소개 : 2학기 공통프로젝트 팀</span>
                </GroupInfoText>
                <Calendar />
            </div>
        </>
    );
};

export default MainPageTemplates;
