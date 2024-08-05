import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/group/style.css';
import useGroupStore from '../store/group';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.js'

function CreateGroupModal({ show, handleClose }) {
    const {userId} = useAuthStore.getState().getUserInfo()
    const navigate = useNavigate();

    // 그룹이름과 그룹설명 변수 세팅
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    
    // 그룹생성함수 import
    const makeGroup = useGroupStore((state) => state.makeGroup);

    // base폴더 만들기
    const makeMainFolder = useGroupStore((state) => state.createFolder)

    // 메인페이지 만들기
    const makeMainPage = useGroupStore((state) => state.createFile)
    const fileText = ''

    // 요청하기, 성공시 1. base폴더 만들고 2. 메인페이지 만들고 3. 그룹 내부 페이지 이동하기 
    const handleGreateGroup = async () => {
        try {
            const response = await makeGroup({ userId, groupName, description });
            console.log('그룹 생성 완료', response);
            handleClose(); // 모달 닫기
            const groupId = response.teamId;
            // await makeMainFolder({ groupId, parentId:0, folderName:"base" });
            // await makeMainPage({ groupId, folderId:0, fileName:"mainPage", file:fileText });
            navigate(`/group/${groupId}/main/`)
        } catch (err) {
            console.log('그룹 생성 실패', err);
        }
    }

    return (
        <Modal id="modal-background" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>그룹 생성</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body">
                <form>
                    <div>
                        <label htmlFor="group-name" className='mb-2'>
                            그룹 이름
                        </label>
                        <input
                            type="text"
                            placeholder="그룹 이름"
                            className="form-control"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <br />
                        <label htmlFor="group-description" className='mb-2'>
                            그룹 소개
                        </label>
                        <input
                            type="text"
                            placeholder="그룹 소개"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer id="modal-footer-button">
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleGreateGroup}>
                    생성
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateGroupModal;
