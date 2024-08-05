import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import GroupDetailInfo from '../components/group/groupDetailInfo.jsx';
import SideBar from '../components/group/sideBar.jsx';
import '../css/group/groupDetail.css';

const GroupDetailView = () => {
    const location = window.location.pathname;

    let type;
    if (location.includes('/main')) {
        type = 'main';
    } else if (location.includes('/overview')) {
        type = 'overview';
    } else if (location.includes('/code/')) {
        type = 'code';
    } else if (location.includes('/time-overview/')) {
        type = 'time-overview';
    } else {
        type = 'normal';
    }

    const { pageId, groupId, } = useParams();
    
    return (
        <div id="group-detail-info">
            <div id="sidebar">
            <SideBar groupId={groupId}/>
            </div>
            <div id='group-detail-info-page'>
            <GroupDetailInfo pageId={pageId} type={type} groupId={groupId}/>
            </div>
        </div>
    );
};

export default GroupDetailView;
