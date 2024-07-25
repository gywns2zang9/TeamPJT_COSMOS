import React from "react";
import { useParams } from "react-router-dom";
import GroupDetailInfo from '../components/group/groupDetailInfo.jsx';
import SideBar from '../components/group/sideBar.jsx';
import '../css/group/groupDetail.css';

const GroupDetailView = () => {
    const { pageId, groupId } = useParams();
    return (
        <div id="group-detail-info">
            <SideBar groupId={groupId}/>
            <GroupDetailInfo pageId={pageId} groupId={groupId}/>
        </div>
    );
};

export default GroupDetailView;
