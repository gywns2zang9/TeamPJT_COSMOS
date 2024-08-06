import React from "react";
import { useParams } from "react-router-dom";
import GroupDetailInfo from '../components/group/groupDetailInfo.jsx';
import SideBar from '../components/group/sideBar.jsx';
import '../css/group/groupDetail.css';

const GroupDetailView = () => {
    const { pageId, groupId } = useParams();
    return (
        <div id="group-detail-info">
            <div id="sidebar">
            <SideBar groupId={groupId}/>
            </div>
            <div id='group-detail-info-page'>
            <GroupDetailInfo pageId={pageId} groupId={groupId}/>
            </div>
        </div>
    );
};

export default GroupDetailView;
