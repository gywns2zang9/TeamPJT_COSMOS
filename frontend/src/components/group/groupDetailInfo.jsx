// src/components/group/groupDetailInfo.jsx
import React from "react";
import MainPageTemplates from "./mainPageTemplates"; // 메인 페이지 템플릿 컴포넌트를 가져옵니다.
import MarkdownEditor from "./markdownEditor"; // 마크다운 편집기 컴포넌트를 가져옵니다.

function GroupDetailInfo({ pageId, groupId }) {
    return (
        <>
            <div>
                {pageId === '0' ? (
                    <MainPageTemplates pageId={pageId} groupId={groupId}/>
                ) : (
                    <MarkdownEditor pageId={pageId} groupId={groupId}/>
                )}
            </div>
        </>
    )
}

export default GroupDetailInfo;
