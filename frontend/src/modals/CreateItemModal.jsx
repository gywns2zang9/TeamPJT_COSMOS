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
                    <hr />
                    {typeValue !== 'folder' && (
                        <Form.Group controlId="formItemType" >
                            <Form.Label>어떤 페이지를 만드시나요?</Form.Label>
                            <div className="mt-3 d-flex">
                                <Form.Check
                                    type="radio"
                                    label="일반페이지"
                                    name="itemType"
                                    value="NORMAL"
                                    checked={typeValue === "NORMAL"}
                                    onChange={handleTypeChange}
                                    className="me-5"
                                />
                                <Form.Check
                                    type="radio"
                                    label="코드페이지"
                                    name="itemType"
                                    value="CODE"
                                    checked={typeValue === "CODE"}
                                    onChange={handleTypeChange}
                                    className="ms-5"
                                />
                            </div>
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
