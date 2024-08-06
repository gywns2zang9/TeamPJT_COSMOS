import React from "react";
import { Button, Modal } from "react-bootstrap";

const StartVideoModal = ({ show, handleClose, handleLeaveSession }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>화상회의 종료</Modal.Title>
      </Modal.Header>
      <Modal.Body>화상회의를 종료하시겠습니까?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          돌아가기
        </Button>
        <Button variant="primary" onClick={handleLeaveSession}>
          종료하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StartVideoModal;
