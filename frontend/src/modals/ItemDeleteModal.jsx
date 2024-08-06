import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ItemDeleteModal = ({ show, handleClose, handleDelete }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>!주의!</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
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
};

export default ItemDeleteModal;