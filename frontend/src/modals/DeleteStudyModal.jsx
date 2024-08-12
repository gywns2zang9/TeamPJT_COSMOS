import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useGroupStore from '../store/group.js';
import { useNavigate } from 'react-router-dom';

function DeleteStudyModal({ show, handleClose, groupId, studyId }) {
    const deleteStudy = useGroupStore((state) => state.deleteStudy);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteStudy({ groupId, studyId});
            handleClose();
            navigate(`/group/${groupId}/main/`);
            window.location.reload();  
        } catch (err) {
            console.error('삭제 실패 -> ', err);
        }
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>스터디 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>정말로 이 스터디를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    삭제
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteStudyModal;
