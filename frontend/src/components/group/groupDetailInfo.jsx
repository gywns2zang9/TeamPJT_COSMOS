// src/components/group/groupDetailInfo.jsx
import React from "react";
import MainPageTemplates from "./mainPageTemplates"; // 메인 페이지 템플릿 컴포넌트를 가져옵니다.
import MarkdownEditor from "./markdownEditor"; // 마크다운 편집기 컴포넌트를 가져옵니다.

function GroupDetailInfo({ pageId, groupId }) {
  return (
    <>
      <div>
        {/* pageId가 "0"인 경우, MainPageTemplates 컴포넌트를 렌더링합니다.
            그렇지 않은 경우, MarkdownEditor 컴포넌트를 렌더링합니다. */}
        {pageId === "0" ? (
          <MainPageTemplates pageId={pageId} groupId={groupId} />
        ) : (
          <MarkdownEditor pageId={pageId} groupId={groupId} />
        )}
      </div>
    </>
  );
}

export default GroupDetailInfo;
