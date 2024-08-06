import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaFolderPlus,
  FaFileAlt,
  FaTrashAlt,
  FaCog,
  FaPlay,
  FaUserPlus,
  FaFolder,
  FaFile,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import "../../css/group/sideBar.css";
import GroupSettingsModal from "../../modals/GroupSettingsModal";
import InviteGroupModal from "../../modals/InviteGroupModal";
import CreateItemModal from '../../modals/CreateItemModal.jsx';
import StartVideoModal from '../../modals/StartVideoModal.jsx';
import ItemDeleteModal from '../../modals/ItemDeleteModal.jsx';
import useGroupStore from '../../store/group.js';
import MainPageTemplates from './template/mainPageTemplates.jsx';
import CodePageTemplates from './template/codePageTemplates.jsx';
import MarkDownEditor from './template/NormalTemplates.jsx';
import OverviewPageTemplates from './template/OverviewPageTemplates.jsx';

// 초기 폴더와 파일 구조
const initialStructure = {
  folders: [],
  files: [],
};

function SideBar({ groupId }) {
  const loadFolderInfo = useGroupStore((state) => state.loadFolderInfo); // 폴더 정보 불러오기
  const [isOpen, setIsOpen] = useState(true); // 사이드바 오픈 여부
  const [structure, setStructure] = useState(initialStructure); // 디렉토리 구조
  const [showSettingsModal, setShowSettingsModal] = useState(false); // 그룹설정
  const [showInviteModal, setShowInviteModal] = useState(false); // 그룹초대
  const [editingItemId, setEditingItemId] = useState(null); // 폴더/파일 이름변경
  const [editName, setEditName] = useState(""); // 폴더파일 이름변경
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // 삭제확인
  const [itemToDelete, setItemToDelete] = useState(null); // 삭제
  const [sidebarWidth, setSidebarWidth] = useState(250); // 사이드바 너비
  const [expandedFolders, setExpandedFolders] = useState({}); // 폴더 확장
  const sidebarRef = useRef(null); // 사이드바 크기조절
  const resizerRef = useRef(null); // 사이드바 크기조절
  const navigate = useNavigate(); // 페이지 이동
  const [showConfirmVideoStart, setShowConfirmVideoStart] = useState(false); // 화상회의 시작
  // 아이템 생성 상태
  const [showCreateItemModal, setShowCreateItemModal] = useState(false); // 아이템 생성 모달
  const [newItemType, setNewItemType] = useState(""); // 생성할 아이템의 타입
  const [newItemParentId, setNewItemParentId] = useState(null); // 생성할 아이템의 부모 ID
  const [newItemName, setNewItemName] = useState(""); // 생성할 아이템의 이름을
  const [rootId, setRootId] = useState(null); // 루트폴더 아이디 저장
  const createFile = useGroupStore((state) => state.createFile);
  const createFolder = useGroupStore((state) => state.createFolder);

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

  // 마우스 이벤트 핸들러 설정
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
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e) => {
      if (e.target === resizerRef.current) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

    // 최상위 폴더 로드
    useEffect(() => {
        const loadRootFolders = async () => {
            try {
                const { folderId, folders, files } = await loadFolderInfo({groupId, folderId:0});
                const rootFolder = {
                    'type':'folder',
                    'id':folderId,
                    'name':'Root',
                    'parentId':null,
                }
                setRootId(folderId);
                setExpandedFolders(prev => ({
                    ...prev,
                    [folderId]: true,
                }));
                setStructure(prev => ({
                    folders,
                    files
                }));
                setStructure(prev => ({
                    ...prev,
                    folders: [rootFolder]
                }));
            } catch (err) {
                console.error('폴더 로딩 실패 -> ', err);
            }
        };
        loadRootFolders();
    }, [groupId, loadFolderInfo]);

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

  // 화상회의시작하기
  const handleOpenVideoStartModal = () => {
    setShowConfirmVideoStart(true);
  };

  // 화상회의 모달 닫기
  const handleCloseVideoStartModal = () => {
    setShowConfirmVideoStart(false);
  };

  const handleStartVideo = () => {
    // 화상 회의 시작 로직 추가
    navigate(`/conference/${groupId}`);
    setShowConfirmVideoStart(false);
  };

  // 다음 ID 가져오기
  const getNextId = (type) => {
    const items = type === "folder" ? structure.folders : structure.files;
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  };

  // 항목 추가
  const handleAddItemClick = (type, parentId) => {
    setNewItemType(type); // 타입
    setNewItemParentId(parentId); // 부모 ID
    setNewItemName(""); // 이름 입력
    setShowCreateItemModal(true); // 아이템 생성 모달
  };

  // 항목 추가 저장
  const handleCreateItemSave = () => {
    if (newItemName.trim()) {
      const newId = getNextId(newItemType);
      setStructure((prev) => {
        const parentId = newItemParentId || rootId;
        const newItem = {
          id: newId,
          type: newItemType,
          name: newItemName,
          parentId: parentId,
          content: "",
        };
        if (newItemType === "folder") {
          createFolder({
            groupId,
            parentId: parentId,
            folderName: newItemName,
          });
        } else if (newItemType === "file") {
          createFile({
            groupId,
            folderId: parentId,
            fileName: newItemName,
            type: newItemType,
          });
        }

        return {
          ...prev,
          [newItemType === "folder" ? "folders" : "files"]: [
            ...prev[newItemType === "folder" ? "folders" : "files"],
            newItem,
          ],
        };
      });
      setShowCreateItemModal(false);
    }
  };

  // 항목 추가 모달 닫기
  const handleCreateItemClose = () => {
    setShowCreateItemModal(false);
  };

  // 항목 삭제
  const handleDeleteItem = (id, parentId) => {
    setItemToDelete({ id, parentId });
    setShowConfirmDelete(true);
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const { id } = itemToDelete;
      setStructure((prev) => ({
        ...prev,
        folders: prev.folders.filter((folder) => folder.id !== id),
        files: prev.files.filter((file) => file.id !== id),
      }));
      setShowConfirmDelete(false);
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

  // 폴더 확장
  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // 폴더 렌더링
  const renderFolder = (folder) => {
    if (folder.id === rootId) {
      return (
        <div className="sidebar-content">
          {renderFolder(
            structure.folders.filter((f) => f.parentId === folder.id)
          )}
          {renderFiles(structure.files.filter((f) => f.parentId === folder.id))}
        </div>
      );
    }
    const isExpanded = expandedFolders[folder.id] || false;
    const childFolders = structure.folders.filter(
      (f) => f.parentId === folder.id
    );
    const childFiles = structure.files.filter((f) => f.parentId === folder.id);

    return (
      <div key={folder.id} className="folder">
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
                <span>{folder.name}</span>
              )}
            </div>
          </OverlayTrigger>
          <div className="folder-actions ms-auto">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>폴더 추가</Tooltip>}
            >
              <Button
                variant="link"
                size="sm"
                onClick={() => handleAddItemClick("folder", folder.id)}
              >
                <FaFolderPlus />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>파일 추가</Tooltip>}
            >
              <Button
                variant="link"
                size="sm"
                onClick={() => handleAddItemClick("file", folder.id)}
              >
                <FaFileAlt />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>삭제</Tooltip>}>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleDeleteItem(folder.id)}
              >
                <FaTrashAlt />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
        {isExpanded && (
          <div className="folder-contents ms-3">
            {childFolders.map(renderFolder)}
            {renderFiles(childFiles)}
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
                  <span>{file.name}</span>
                )}
              </div>
            </OverlayTrigger>
            <div className="file-actions ms-auto">
              <OverlayTrigger placement="top" overlay={<Tooltip>삭제</Tooltip>}>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleDeleteItem(file.id)}
                >
                  <FaTrashAlt />
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 파일 클릭시 페이지 전환
  const handleFileClick = (file) => {
    const { id, type } = file;
    const pageMap = {
      MAIN: `/group/${groupId}/main/`,
      OVERVIEW: `/group/${groupId}/overview/`,
      NORMAL: `/group/${groupId}/${id}/`,
      CODE: `/group/${groupId}/code/${id}/`,
      TIME_OVERVIEW: `/group/${groupId}/time-overview/${id}/`,
    };
    navigate(pageMap[type], { state: { fileId: id, fileName: file.name } });
  };

  return (
    <div className="sidebar" ref={sidebarRef} style={{ width: sidebarWidth }}>
      <div className="sidebar-header" onClick={toggleSideBar}>
        <Button variant="link" size="m" >
          {isOpen ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </Button>
      </div>
      <div style={{ textAlign: "center" }}>
        <OverlayTrigger placement="top" overlay={<Tooltip>화상회의</Tooltip>}>
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
          <div className="actions">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>폴더 추가</Tooltip>}
            >
              <Button
                variant="link"
                size="sm"
                onClick={() => handleAddItemClick("folder", null)}
              >
                <FaFolderPlus />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>파일 추가</Tooltip>}
            >
              <Button
                variant="link"
                size="sm"
                onClick={() => handleAddItemClick("file", null)}
              >
                <FaFileAlt />
              </Button>
            </OverlayTrigger>
          </div>
          <div className="folders">
            {structure.folders
              .filter((folder) => folder.parentId === null)
              .map(renderFolder)}
          </div>
        </div>
      )}

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
    </div>
  );
}

export default SideBar;
