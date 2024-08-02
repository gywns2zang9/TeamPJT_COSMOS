import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateItemModal = ({ show, handleClose, handleSave, nameValue, setNameValue, typeValue, setTypeValue }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>아이템 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="itemName">
                        <Form.Label>이름</Form.Label>
                        <Form.Control
                            type="text"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                        />
                    </Form.Group>
                    {typeValue === 'file' && (
                        <Form.Group controlId="fileType" className="mt-3">
                            <Form.Label>파일 유형</Form.Label>
                            <Form.Control
                                as="select"
                                value={typeValue}
                                onChange={(e) => setTypeValue(e.target.value)}
                            >
                                <option value="mainPageTemplates">Main Page Templates</option>
                                <option value="codePageTemplates">Code Page Templates</option>
                                <option value="markdownEditor">Markdown Editor</option>
                                <option value="studyTemplates">Study Templates</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateItemModal;
