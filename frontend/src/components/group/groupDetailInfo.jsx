import React from "react";
import MainPageTemplates from "./template/mainPageTemplates"; 
import MarkdownEditor from "./template/NormalTemplates"; 
import CodePageTemplates from "./template/codePageTemplates";
import OverviewPageTemplagtes from "./template/OverviewPageTemplates";
import NormalTemplates from "./template/NormalTemplates";
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
            case 'normal':
                return <NormalTemplates groupId={groupId} pageId={pageId}/>;
            case 'time-overview':
                return <TimeOverviewTemplates groupId={groupId} pageId={pageId}/>;
            default:
                return <MarkdownEditor pageId={pageId} groupId={groupId} />;
        }
    };
    return (
        <div>
            {renderTemplate()}
        </div>
    );
}

export default GroupDetailInfo;
