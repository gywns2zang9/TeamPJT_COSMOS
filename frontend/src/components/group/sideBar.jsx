import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import GroupSettingsModal from "../../modals/GroupSettingsModal";
import InviteGroupModal from "../../modals/InviteGroupModal";
import { FaFolderPlus, FaFileAlt, FaTrashAlt, FaCog, FaPlay, FaUserPlus, FaFolder, FaFile, FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronDown, FaChevronRight } from 'react-icons/fa'; 
import '../../css/group/sideBar.css';
import useGroupStore from '../../store/group.js';
import CreateItemModal from '../../modals/CreateGroupModal.jsx';
import StartVideoModal from '../../modals/StartVideoModal.jsx';
import ItemDeleteModal from '../../modals/ItemDeleteModal.jsx';

// 초기 폴더와 파일 구조 
const initialStructure = {
    folders: [
    ],
    files: [
    ]
};


function SideBar({ groupId }) {
    const { loadFolderInfo } = useGroupStore(); // 폴더 정보 불러오기
    const [isOpen, setIsOpen] = useState(true); // 사이드바 오픈 여부
    const [structure, setStructure] = useState(initialStructure);   // 디렉토리 구조
    const [showSettingsModal, setShowSettingsModal] = useState(false);  // 그룹설정
    const [showInviteModal, setShowInviteModal] = useState(false);  // 그룹초대
    const [editingItemId, setEditingItemId] = useState(null);   // 폴더/파일 이름변경
    const [editName, setEditName] = useState('');   // 폴더파일 이름변경
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);  // 삭제확인
    const [itemToDelete, setItemToDelete] = useState(null); // 삭제
    const [sidebarWidth, setSidebarWidth] = useState(250);  // 사이드바 너비
    const [expandedFolders, setExpandedFolders] = useState({}); // 폴더 확장
    const sidebarRef = useRef(null);    // 사이드바 크기조절
    const resizerRef = useRef(null);    // 사이드바 크기조절
    const navigate = useNavigate();     // 페이지 이동
    const [showConfirmVideoStart, setShowConfirmVideoStart] = useState(false);  // 화상회의 시작
    // 아이템 생성 상태
    const [showCreateItemModal, setShowCreateItemModal] = useState(false); // 아이템 생성 모달
    const [newItemType, setNewItemType] = useState(''); // 생성할 아이템의 타입
    const [newItemParentId, setNewItemParentId] = useState(null); // 생성할 아이템의 부모 ID
    const [newItemName, setNewItemName] = useState(''); // 생성할 아이템의 이름을

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
                const newWidth = Math.max(100, e.clientX - sidebarRef.current.getBoundingClientRect().left);
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        const handleMouseDown = (e) => {
            if (e.target === resizerRef.current) {
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        };

        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // 최상위 폴더 로드
    useEffect(() => {
        const loadRootFolders = async () => {
            const { folders, files } = await loadFolderInfo({groupId, pageId:0});
            setStructure(prev => ({
                folders,
                files: [...prev.files, ...files]
            }));
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

    // 다음 ID 가져오기
    const getNextId = (type) => {
        const items = type === 'folder' ? structure.folders : structure.files;
        return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    };

    // 항목 추가
    const handleAddItemClick = (type, parentId) => {
        setNewItemType(type); // 타입
        setNewItemParentId(parentId); // 부모 ID
        setNewItemName(''); // 이름 입력
        setShowCreateItemModal(true); // 아이템 생성 모달
    };

    // 항목 추가 저장
    const handleCreateItemSave = () => {
        if (newItemName.trim()) {
            const newId = getNextId(newItemType);
            setStructure(prev => {
                const newItem = { id: newId, type: newItemType, name: newItemName, parentId: newItemParentId, content: newItemType === 'page' ? '' : {} };
    
                return {
                    ...prev,
                    [newItemType === 'folder' ? 'folders' : 'files']: [
                        ...prev[newItemType === 'folder' ? 'folders' : 'files'],
                        newItem
                    ]
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
    const confirmDelete = () => {
        setStructure(prev => {
            const deleteItem = (items, idToDelete) => {
                return items.filter(item => item.id !== idToDelete);
            };

            return {
                ...prev,
                folders: deleteItem(prev.folders, itemToDelete.id),
                files: deleteItem(prev.files, itemToDelete.id)
            };
        });
        setShowConfirmDelete(false);
        setItemToDelete(null);
    };

    // 삭제 취소
    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setItemToDelete(null);
    };

    // 페이지 선택 
    const handleSelectPage = (pageId) => {
        navigate(`/group/${groupId}/${pageId}`);
    };

    // 더블 클릭 
    const handleDoubleClick = (id, name) => {
        setEditingItemId(id);
        setEditName(name);
    };

    // 이름 변경 
    const handleChangeName = (e) => {
        if (e.key === 'Enter') {
            setStructure(prev => {
                const updateName = (items, idToUpdate, newName) => {
                    return items.map(item => item.id === idToUpdate ? { ...item, name: newName } : item);
                };

                return {
                    ...prev,
                    folders: updateName(prev.folders, editingItemId, editName),
                    files: updateName(prev.files, editingItemId, editName)
                };
            });
            setEditingItemId(null);
            setEditName('');
        }
    };

    // 폴더 확장/축소 토글
    const toggleFolder = (folderId) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId] // 폴더의 확장 상태 토글
        }));
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
        setShowConfirmVideoStart(false);
    };

    // 트리 렌더링
    const renderTree = (parentId, depth = 0) => {
        return (
            <ul className="no-style-list">
                {structure.folders.filter(folder => folder.parentId === parentId).map(folder => (
                    <li key={folder.id} style={{ marginLeft: `${depth * 20}px` }}> {/* 변경된 부분 */}
                        {editingItemId === folder.id ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleChangeName}
                                autoFocus
                            />
                        ) : (
                            <div>
                                {/* 폴더 이름과 확장/축소 버튼 */}
                                <Button variant="link" onClick={() => toggleFolder(folder.id)}>
                                    {expandedFolders[folder.id] ? <FaChevronDown /> : <FaChevronRight />}
                                </Button>
                                <span onDoubleClick={() => handleDoubleClick(folder.id, folder.name)}>
                                    <FaFolder className="icon" /> {folder.name}
                                </span>
                            </div>
                        )}
                        {!['base-folder', 'group-info-page'].includes(folder.id) && (
                            <>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-add-folder`}>Add Folder</Tooltip>}
                                >
                                    <Button variant="link" className="add-folder-btn" onClick={() => handleAddItemClick('folder', folder.id)}>
                                        <FaFolderPlus />
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-add-page`}>Add Page</Tooltip>}
                                >
                                    <Button variant="link" className="add-page-btn" onClick={() => handleAddItemClick('page', folder.id)}>
                                        <FaFileAlt />
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-delete`}>Delete</Tooltip>}
                                >
                                    <Button variant="link" className="delete-btn" onClick={() => handleDeleteItem(folder.id, parentId)}>
                                        <FaTrashAlt />
                                    </Button>
                                </OverlayTrigger>
                            </>
                        )}
                        {/* 폴더가 확장된 경우에만 하위 폴더와 파일 렌더링 */}
                        {expandedFolders[folder.id] && renderTree(folder.id, depth + 1)}
                    </li>
                ))}
                {structure.files.filter(file => file.parentId === parentId).map(file => (
                    <li key={file.id} style={{ marginLeft: `${depth * 20}px` }}>
                        {editingItemId === file.id ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleChangeName}
                                autoFocus
                            />
                        ) : (
                            <span onClick={() => handleSelectPage(file.id)} onDoubleClick={() => handleDoubleClick(file.id, file.name)}>
                                <FaFile className="icon" /> {file.name}
                            </span>
                        )}
                        {!['base-folder', 'group-info-page'].includes(file.id) && (
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-delete-file`}>Delete</Tooltip>}
                            >
                                <Button variant="link" className="delete-btn" onClick={() => handleDeleteItem(file.id, parentId)}>
                                    <FaTrashAlt />
                                </Button>
                            </OverlayTrigger>
                        )}
                    </li>
                ))}
            </ul>
        );
    };



    return (
        <>
            <div ref={sidebarRef} className={`sidebar ${sidebarWidth <= 100 ? 'closed' : 'open'}`} style={{ width: `${sidebarWidth}px` }}>
                <div className='sidebar-head' onClick={handleOpenVideoStartModal}>
                    화상회의 시작하기 <FaPlay style={{fontSize:'12px'}}/>
                </div>


                <div className="sidebar-header" onClick={toggleSideBar}>
                    {sidebarWidth <= 100 ? (
                        <FaAngleDoubleRight  className="toggle-btn" /> // 오른쪽 아이콘
                    ) : (
                        <FaAngleDoubleLeft className="toggle-btn" /> // 왼쪽 아이콘
                    )}
                </div>
                <div className="sidebar-content">
                    {renderTree(null)}
                </div>
                {isOpen ? 
                    <div className="sidebar-footer">
                        <Button variant="link" onClick={handleOpenSettingsModal}>
                            <FaCog /> 그룹 설정
                        </Button>
                        <Button variant="link" onClick={handleOpenInviteModal}>
                            <FaUserPlus /> 멤버 초대하기
                        </Button>
                    </div>
                : 
                    <div className="sidebar-footer closed">
                        <Button variant="link" onClick={handleOpenSettingsModal}>
                            <FaCog />
                        </Button>
                        <Button variant="link" onClick={handleOpenInviteModal}>
                            <FaUserPlus />
                        </Button>
                    </div>
                }
                <div ref={resizerRef} className="resizer"></div>
            </div>
            {/* 폴더파일 생성 모달 */}
            <CreateItemModal show={showCreateItemModal} handleClose={handleCreateItemClose} handleSave={handleCreateItemSave} value={newItemName} setValue={setNewItemName} />
            {/* 그룹설정모달 */}
            <GroupSettingsModal show={showSettingsModal} handleClose={handleCloseSettingsModal} groupId={groupId}/>
            {/* 그룹초대모달 */}
            <InviteGroupModal show={showInviteModal} handleClose={handleCloseInviteModal} groupId={groupId}/>
            {/* 화상회의 시작 모달 */}
            <StartVideoModal show={showConfirmVideoStart} handleClose={handleCloseVideoStartModal} handleStartVideo={handleStartVideo} />
            {/* 아이템 삭제 모달 */}
            <ItemDeleteModal show={showConfirmDelete} handleClose={handleCancelDelete} handleDelete={confirmDelete} />
        </>
    );
}

export default SideBar;