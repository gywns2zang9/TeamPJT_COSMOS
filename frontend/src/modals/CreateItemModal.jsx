import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CreateItemModal({ show, handleClose, handleSave, nameValue, setNameValue, typeValue, setTypeValue }) {
    const handleNameChange = (e) => setNameValue(e.target.value);
    const handleTypeChange = (e) => setTypeValue(e.target.value);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{typeValue === 'folder' ? '새 폴더 생성' : '새 파일 생성'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formItemName">
                        <Form.Label>{typeValue === 'folder' ? '폴더 이름' : '파일 이름'}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={nameValue}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                    {typeValue !== 'folder' && (
                        <Form.Group controlId="formItemType" className="mt-3">
                            <Form.Label>유형</Form.Label>
                            <Form.Check
                                type="radio"
                                label="일반페이지"
                                name="itemType"
                                value="NORMAL"
                                checked={typeValue === "NORMAL"}
                                onChange={handleTypeChange}
                            />
                            <Form.Check
                                type="radio"
                                label="코드페이지"
                                name="itemType"
                                value="CODE"
                                checked={typeValue === "CODE"}
                                onChange={handleTypeChange}
                            />
                            <Form.Check
                                type="radio"
                                label="전체개요페이지"
                                name="itemType"
                                value="OVERVIEW"
                                checked={typeValue === "OVERVIEW"}
                                onChange={handleTypeChange}
                            />
                            <Form.Check
                                type="radio"
                                label="개요페이지"
                                name="itemType"
                                value="TIMEOVERVIEW"
                                checked={typeValue === "TIMEOVERVIEW"}
                                onChange={handleTypeChange}
                            />
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateItemModal;
