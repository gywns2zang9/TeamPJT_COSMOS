import React from "react";
import MainPageTemplates from "./mainPageTemplates";
import MarkdownEditor from "./markdownEditor";

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