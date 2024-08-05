// src/components/group/groupDetailInfo.jsx
import React from "react";
import MainPageTemplates from "./template/mainPageTemplates"; // 메인 페이지 템플릿 컴포넌트를 가져옵니다.
import MarkdownEditor from "./template/NormalTemplates"; // 마크다운 편집기 컴포넌트를 가져옵니다.
import CodePageTemplates from "./template/codePageTemplates";
import OverviewPageTemplagtes from "./template/OverviewPageTemplates";
import NormalTemplates from "./template/NormalTemplates";
import TimeOverviewTemplates from "./template/TimeOverviewTemplates";

function GroupDetailInfo({ pageId, groupId, type }) {
    const renderTemplate = () => {
        switch (type) {
            case 'main':
                return <MainPageTemplates groupId={groupId} />;
            case 'overview':
                return <OverviewPageTemplagtes groupId={groupId} />;
            case 'code':
                return <CodePageTemplates groupId={groupId} />;
            case 'normal':
                return <NormalTemplates groupId={groupId} />;
            case 'time-overview':
                return <TimeOverviewTemplates groupId={groupId} />;
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
