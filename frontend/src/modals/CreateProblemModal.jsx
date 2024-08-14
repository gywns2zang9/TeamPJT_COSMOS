import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import useGroupStore from "../store/group";

function CreateProblemModal({
  show,
  handleClose,
  groupId,
  studyId,
  existingProblems,
}) {
  const [problemSite, setProblemSite] = useState("");
  const [problemNumber, setProblemNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createProblem = useGroupStore((state) => state.createProblem);

  useEffect(() => {
    if (show) {
      setProblemNumber("");
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problemNumber.trim()) {
      alert("문제 번호를 입력하세요.");
      return;
    }

    const isAlreadyAdded = existingProblems.some(
      (problem) => String(problem.number) === problemNumber
    );
    if (isAlreadyAdded) {
      alert("이미 추가된 문제입니다.");
      return;
    }

    setIsLoading(true); // 로딩 상태 시작
    try {
      await createProblem({ groupId, problemNumber, studyId });
      window.location.reload();
      handleClose();
    } catch (error) {
      console.error("문제를 추가하는 중 오류가 발생했습니다.", error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>문제 추가하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          현재는 Baekjoon의 문제만 제공합니다.. 추후 추가 예정
          <Form.Group controlId="problemNumber" style={{ marginTop: "1rem" }}>
            <Form.Label>문제 번호</Form.Label>
            <Form.Control
              type="text"
              placeholder="문제 번호를 입력하세요"
              maxLength={9}
              value={problemNumber}
              onChange={(e) => setProblemNumber(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginTop: "1rem" }}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                문제를 불러오는 중...
              </>
            ) : (
              "제출"
            )}
          </Button>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            style={{ marginTop: "1rem", marginLeft: "4px" }}
          >
            닫기
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateProblemModal;
