import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupDetailInfo from '../components/group/groupDetailInfo.jsx';
import SideBar from '../components/group/sideBar.jsx';
import '../css/group/groupDetail.css';
import useGroupStore from "../store/group.js";

const GroupDetailView = () => {
    const { fileId, groupId } = useParams();

    const location = window.location.pathname;
    const [loadedType, setLoadedType] = useState('main');
    const getFile = useGroupStore(state => state.getFile);
    let type;

    useEffect(() => {
        setLoadedType(getFile({ groupId, fileId }));
    }, [getFile]);

    switch (loadedType) {
        case 'Main':
            type = 'main';
            break;
        case 'Code':
            type = 'code';
            break;
        case 'OverView':
            type = 'overview';
            break;
        case 'TimeOverView':
            type = 'time-overview';
            break;
        case 'Normal':
            type = 'normal';
            break;
        default:
            type = 'main';
    }

    if (location) {
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
    }


    return (
        <div id="group-detail-info">
            <div id="sidebar">
                <SideBar groupId={groupId} />
            </div>
            <div id='group-detail-info-page'>
                <GroupDetailInfo pageId={fileId} type={type} groupId={groupId} />
            </div>
        </div>
    );
};

export default GroupDetailView;
