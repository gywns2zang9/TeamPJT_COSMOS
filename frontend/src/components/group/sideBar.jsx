import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaFolderPlus, FaFileAlt, FaTrashAlt, FaCog, FaPlay, FaUserPlus, FaFolder, FaFile, FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../../css/group/sideBar.css";
import GroupSettingsModal from "../../modals/GroupSettingsModal";
import InviteGroupModal from "../../modals/InviteGroupModal";
import CreateItemModal from '../../modals/CreateItemModal.jsx';
import StartVideoModal from '../../modals/StartVideoModal.jsx';
import ItemDeleteModal from '../../modals/ItemDeleteModal.jsx';
import useGroupStore from '../../store/group.js';

// 초기 폴더와 파일 구조
const initialStructure = {
  folders: [],
  files: [],
};

function SideBar({ groupId }) {
  const loadFolderInfo = useGroupStore((state) => state.loadFolderInfo); // 폴더 정보 불러오기
  const [structure, setStructure] = useState(initialStructure); // 디렉토리 구조
  const [editingItemId, setEditingItemId] = useState(null); // 폴더/파일 이름변경
  const [editName, setEditName] = useState(""); // 폴더파일 이름변경
  const [expandedFolders, setExpandedFolders] = useState({}); // 폴더 확장
  // 설정
  const [showInviteModal, setShowInviteModal] = useState(false); // 그룹초대
  const [showSettingsModal, setShowSettingsModal] = useState(false); // 그룹설정
  // 사이드바 크기
  const [isOpen, setIsOpen] = useState(true); // 사이드바 오픈 여부
  const [sidebarWidth, setSidebarWidth] = useState(250); // 사이드바 너비
  const [isResizing, setIsResizing] = useState(false); // 사이드바 조절 상태

  const sidebarRef = useRef(null); // 사이드바
  const resizerRef = useRef(null); // 사이드바 조절 핸들
  // 페이지 이동
  const navigate = useNavigate(); 
  // 화상회의 시작
  const [showConfirmVideoStart, setShowConfirmVideoStart] = useState(false); 
  // 아이템 생성 및 삭제
  const [showCreateItemModal, setShowCreateItemModal] = useState(false); // 아이템 생성 모달
  const [newItemType, setNewItemType] = useState(""); // 생성할 아이템의 타입
  const [newItemParentId, setNewItemParentId] = useState(null); // 생성할 아이템의 부모 ID
  const [newItemName, setNewItemName] = useState(""); // 생성할 아이템의 이름
  const [rootId, setRootId] = useState(null); // 루트폴더 아이디 저장
  const createFile = useGroupStore((state) => state.createFile);
  const createFolder = useGroupStore((state) => state.createFolder);
  const [itemToDelete, setItemToDelete] = useState(null); // 삭제
  const deleteFolder = useGroupStore((state) => state.deleteFolder); // 폴더 삭제
  const deleteFile = useGroupStore((state) => state.deleteFile); // 파일 삭제
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // 삭제확인

  // 사이드바 토글
  const toggleSideBar = () => {
    if (sidebarWidth <= 100) {
      setSidebarWidth(250);
    } else {
      setSidebarWidth(100);
    }
  };

  // 사이드바 너비 변화에 따른 isOpen 상태
  useEffect(() => {
    setIsOpen(sidebarWidth > 100);
  }, [sidebarWidth]);

  // 마우스 이벤트 핸들러 설정 - TODO
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizerRef.current && e.buttons === 1) {
        const newWidth = Math.max(
          100,
          e.clientX - sidebarRef.current.getBoundingClientRect().left
        );
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e) => {
      if (e.target === resizerRef.current) {
        setIsResizing(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        e.preventDefault();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // 설정 모달
  const handleOpenSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
  };

  // 초대 모달
  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  // 화상회의 모달
  const handleOpenVideoStartModal = () => {
    setShowConfirmVideoStart(true);
  };

  const handleCloseVideoStartModal = () => {
    setShowConfirmVideoStart(false);
  };

  const handleStartVideo = () => {
    navigate(`/conference/${groupId}`);
    setShowConfirmVideoStart(false);
  };

  // 항목 추가
  const handleAddItemClick = (type, parentId) => {
    setNewItemType(type); // 타입
    setNewItemParentId(parentId); // 부모 ID
    setNewItemName(""); // 이름 입력
    setShowCreateItemModal(true); // 아이템 생성 모달
  };

  // 항목 추가 저장
  const handleCreateItemSave = async () => {
    if (newItemName.trim()) {
      const newItem = {
        id:'',
        type: newItemType,
        name: newItemName,
        parentId: newItemParentId || rootId,
      };
      
      if (newItem.type === "folder") {
        const newLoadFle = await createFolder({
          groupId,
          parentId: newItem.parentId,
          folderName: newItem.name,
        });
        newItem.id = newLoadFle.fileId;
      } else  {
        const newLoadFle = await createFile({
          groupId,
          folderId: newItem.parentId,
          fileName: newItem.name,
          type: newItem.type,
        });
        newItem.id = newLoadFle.fileId;
      }
      setStructure((prev) => {
        return {
          ...prev,
          [newItemType === "folder" ? "folders" : "files"]: [
            ...prev[newItemType === "folder" ? "folders" : "files"],
            newItem,
          ],
        };
      });
      navigate(
        `/group/${groupId}/${newItem.id}/`, 
        { state: { fileId: newItem.id } }
      );
      setShowCreateItemModal(false);
    }
  };

  // 항목 추가 모달 닫기
  const handleCreateItemClose = () => {
    setShowCreateItemModal(false);
  };

  // 항목 삭제 모달 
  const handleDeleteItem = ({id, parentId, type}) => {
    console.log(id, parentId, type);
    setItemToDelete({ id, parentId, type });
    setShowConfirmDelete(true);
  };

  // 삭제 실행
  const handleConfirmDelete = async () => {
    const { id, parentId, type } = itemToDelete;
    console.log(itemToDelete);
    console.log(id, parentId, type);
    try {

      if (type === 'folder') {
        await deleteFolder({ groupId, folderId:id })
      } else {
        await deleteFile({ groupId, fileId:id })
      }
      setStructure((prev) => ({
        ...prev,
        folders: prev.folders.filter((folder) => folder.id !== id),
        files: prev.files.filter((file) => file.id !== id),
      }));
      setShowConfirmDelete(false);
      console.log('삭제 성공');
    } catch (err) {
      console.error('삭제 실패 -> ', err);
    }
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  // 항목 이름 변경
  const handleEditNameChange = (e) => {
    setEditName(e.target.value);
  };

  // 항목 이름 변경 저장
  const handleSaveEditName = () => {
    setStructure((prev) => {
      const updateItemName = (items) =>
        items.map((item) =>
          item.id === editingItemId ? { ...item, name: editName } : item
        );

      return {
        ...prev,
        folders: updateItemName(prev.folders),
        files: updateItemName(prev.files),
      };
    });
    setEditingItemId(null);
    setEditName("");
  };

// 최상위 폴더 로드 
useEffect(() => {
  const loadRootFolder = async () => {
    try {
        const { folderId, folders, files } = await loadFolderInfo({ groupId, folderId: 0 });
        const rootFolder = {
            type: 'folder',
            id: folderId,
            name: 'Root',
            parentId: null,
        };
        setRootId(folderId);
        setExpandedFolders({ [folderId]: true });
        setStructure({
            folders: [rootFolder, ...folders],
            files: files,
        });
    } catch (err) {
        console.error('루트폴더 로드 실패 -> ', err);
    }
  };

    if (structure.files.length === 0) {
        loadRootFolder();
    }
  }, [groupId, loadFolderInfo]);

  // 서브폴더 로드
  const loadSubFolders = async (parentId) => {
    try {
        const { folders, files } = await loadFolderInfo({ groupId, folderId: parentId });
        setStructure((prev) => ({
          folders: [
              ...prev.folders,
              ...folders.filter(f => !prev.folders.some(existingFolder => existingFolder.id === f.id))
          ],
          files: [
              ...prev.files,
              ...files.filter(f => !prev.files.some(existingFile => existingFile.id === f.id))
          ],
      }));
    } catch (err) {
        console.error('Failed to load subfolders:', err);
    }
  };
  
  // 페이지 제목 변경 감지 및 사이드바 업데이트
  useEffect(() => {
    const checkTitleChange = () => {
      const currentTitle = document.title;
      if (currentTitle !== document.title) {
        // 페이지 제목이 변경되었을 때 데이터 다시 불러오기
        loadFolderInfo({ groupId }).then(({ folderId, folders, files }) => {
          setRootId(folderId);
          setStructure({ folders, files });
        });
      }
    };
  
    const intervalId = setInterval(checkTitleChange, 1000); // 1초마다 제목 변경 확인
  
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [groupId, loadFolderInfo]);

  // 폴더 확장
  const toggleFolderExpansion = (folderId) => {
      const isExpanded = expandedFolders[folderId];
      if (isExpanded) {
          setExpandedFolders((prev) => {
              const { [folderId]: _, ...rest } = prev;
              return rest;
          });
      } else {
          setExpandedFolders((prev) => ({
              ...prev,
              [folderId]: true,
          }));
          const hasSubFolders = structure.folders.some((folder) => folder.parentId === folderId);
          if (!hasSubFolders) {
              loadSubFolders(folderId);
          }
      }
  };

  // 파일 클릭시 페이지 전환
  const handleFileClick = (file) => {
    const { id, type } = file;
    const pageMap = {
      MAIN: `/group/${groupId}/main/${id}/`,
      OVERVIEW: `/group/${groupId}/overview/${id}/`,
      CODE: `/group/${groupId}/code/${id}/`,
      TIME_OVERVIEW: `/group/${groupId}/time-overview/${id}/`,
    };
    navigate(pageMap[type], { state: { fileId: id } });
  };

  // 폴더 렌더링
  const renderFolder = (folder) => {
    if (folder.id === rootId) {
      return (
        <div key={folder.id} className="sidebar-content">
          {renderFiles(structure.files.filter((f) => f.parentId === folder.id))}
          {structure.folders.filter((f) => f.parentId === folder.id).map(renderFolder)}
        </div>
      );
    }

    const isExpanded = expandedFolders[folder.id] || false;
    const childFolders = structure.folders.filter((f) => f.parentId === folder.id);
    const childFiles = structure.files.filter((f) => f.parentId === folder.id);

    return (
      <div key={folder.id} className="folder" >
        <div className="d-flex align-items-center">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>{folder.name}</Tooltip>}
          >
            <div
              className="folder-name d-flex align-items-center"
              onClick={() => toggleFolderExpansion(folder.id)}
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              &nbsp;
              <FaFolder className="me-2" />
              {editingItemId === folder.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={handleEditNameChange}
                  onBlur={handleSaveEditName}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEditName()}
                  autoFocus
                />
              ) : (
                <span className="folder-name">{folder.name}</span>
              )}
            </div>
          </OverlayTrigger>
          {/* 폴더 삭제 어떻게 하지 */}
          {/* <div className="folder-actions ms-auto">
            <OverlayTrigger placement="top" overlay={<Tooltip>삭제</Tooltip>}>
              <Button
                variant="link"
                size="sm"
                  onClick={() => handleDeleteItem({ id:folder.id, parentId:folder.parentId, type:'folder'})}
              >
                <FaTrashAlt />
              </Button>
            </OverlayTrigger>
          </div> */}
        </div>
        {isExpanded && (
          <div className="folder-contents ms-3">
            {renderFiles(childFiles)}
            {childFolders.map(renderFolder)}
          </div>
        )}
      </div>
    );
  };

  // 파일 렌더링
  const renderFiles = (files) => {
    return (
      <div className="files">
        {files.map((file) => (
          <div key={file.id} className="file d-flex align-items-center">
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>{file.name}</Tooltip>}
            >
              <div
                className="file-name d-flex align-items-center"
                onClick={() => handleFileClick(file)}
              >
                <FaFile className="me-2" />
                {editingItemId === file.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={handleEditNameChange}
                    onBlur={handleSaveEditName}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEditName()}
                    autoFocus
                  />
                ) : (
                  <span className="file-name">{file.name}</span>
                )}
              </div>
            </OverlayTrigger>
            {/* 파일 삭제 어떻게 하지 */}
            {/* <div className="file-actions ms-auto">
              {(file.type === 'CODE') && (
                <OverlayTrigger placement="top" overlay={<Tooltip>삭제</Tooltip>}>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleDeleteItem({ id:file.id, parentId:file.parentId, type:'file'})}
                  >
                    <FaTrashAlt />
                  </Button>
                </OverlayTrigger>
              )}
            </div> */}
          </div>
        ))}
      </div>
    );
  };

  

  return (
    <div className={`sidebar ${isResizing ? 'resizing' : ''}`} ref={sidebarRef} style={{ width: sidebarWidth }}>
      <div className="sidebar-header" onClick={toggleSideBar}>
        <Button variant="link" size="m" >
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                {isOpen ? '사이드바 접기' : '사이드바 펼치기'}
              </Tooltip>
            }
          >
            <Button variant="link" size="m">
              {isOpen ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
            </Button>
          </OverlayTrigger>
        </Button>
      </div>
      <div style={{ textAlign: "center" }}>
        <OverlayTrigger placement="top" overlay={<Tooltip>버튼을 눌러 화상회의를 시작하세요</Tooltip>}>
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowConfirmVideoStart(true)}
          >
            <FaPlay />
          </Button>
        </OverlayTrigger>
      </div>
      {isOpen && (
        <div className="sidebar-content">
          <div className="folders">
          {structure.folders.filter((folder) => folder.parentId === null).map(renderFolder)}
          </div>
        </div>
      )}
      
      {/* 사이드바 푸터 */}
      <div className="sidebar-footer">
        <OverlayTrigger placement="top" overlay={<Tooltip>설정</Tooltip>}>
          <Button variant="link" size="sm" onClick={handleOpenSettingsModal}>
            <FaCog />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>초대</Tooltip>}>
          <Button variant="link" size="sm" onClick={handleOpenInviteModal}>
            <FaUserPlus />
          </Button>
        </OverlayTrigger>
      </div>

      <div className="sidebar-resizer" ref={resizerRef}></div>

      {/* 모달세팅 */}
      <GroupSettingsModal
        show={showSettingsModal}
        handleClose={handleCloseSettingsModal}
        groupId={groupId}
      />
      <InviteGroupModal
        show={showInviteModal}
        handleClose={handleCloseInviteModal}
        groupId={groupId}
      />
      <CreateItemModal
        show={showCreateItemModal}
        handleClose={handleCreateItemClose}
        handleSave={handleCreateItemSave}
        nameValue={newItemName}
        setNameValue={setNewItemName}
        typeValue={newItemType}
        setTypeValue={setNewItemType}
        groupId={groupId}
      />
      <StartVideoModal
        show={showConfirmVideoStart}
        handleClose={() => setShowConfirmVideoStart(false)}
        handleStartVideo={handleStartVideo}
      />
      <ItemDeleteModal
        show={showConfirmDelete}
        handleClose={handleCancelDelete}
        handleDelete={handleConfirmDelete}
      />
      <div
          ref={resizerRef}
          className="resizer"
          style={{
              width: '10px',
              height: '100%',
              position: 'absolute',
              top: '0',
              right: '0',
              cursor: 'ew-resize',
              backgroundColor: isResizing ? '#aaa' : '#ddd',
              transition: 'background-color 0.2s ease'
          }}
      />
    </div>
  );
}

export default SideBar;
