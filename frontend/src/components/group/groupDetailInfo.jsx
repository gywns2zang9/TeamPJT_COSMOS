import React from "react";
import MainPageTemplates from "./template/mainPageTemplates"; 
import CodePageTemplates from "./template/codePageTemplates";
import OverviewPageTemplagtes from "./template/OverviewPageTemplates";
import TimeOverviewTemplates from "./template/TimeOverviewTemplates";

function GroupDetailInfo({ pageId, groupId, type }) {
    const renderTemplate = () => {
        switch (type) {
            case 'main':
                return <MainPageTemplates groupId={groupId} pageId={pageId}/>;
            case 'overview':
                return <OverviewPageTemplagtes groupId={groupId} pageId={pageId}/>;
            case 'code':
                return <CodePageTemplates groupId={groupId} pageId={pageId}/>;
            case 'time-overview':
                return <TimeOverviewTemplates groupId={groupId} pageId={pageId}/>;
            default:
                return <MainPageTemplates groupId={groupId} pageId={pageId}/>;
        }
    };
    return (
        <div>
            {renderTemplate()}
        </div>
    );
}

export default GroupDetailInfo;
