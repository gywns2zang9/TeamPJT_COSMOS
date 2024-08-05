import React from "react";
import { Button, Modal } from "react-bootstrap";

const StartVideoModal = ({ show, handleClose, handleStartVideo }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>화상회의 시작</Modal.Title>
      </Modal.Header>
      <Modal.Body>화상회의를 시작하시겠습니까?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          돌아가기
        </Button>
        <Button variant="primary" onClick={handleStartVideo}>
          시작하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StartVideoModal;
