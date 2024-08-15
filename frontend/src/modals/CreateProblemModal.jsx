import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import useGroupStore from "../store/group";
import axios from 'axios';

function CreateProblemModal({
  show,
  handleClose,
  groupId,
  studyId,
  existingProblems,
}) {
  const [problemNumber, setProblemNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createProblem = useGroupStore((state) => state.createProblem);
  const maxProblemNumber = 100000

  useEffect(() => {
    if (show) {
      setProblemNumber("");
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 문제 번호가 빈 문자열일 경우
    if (!problemNumber.trim()) {
      alert("문제 번호를 입력하세요.");
      return;
    }

    // 문제 번호가 자연수가 아닌 경우
    if (!/^[1-9]\d*$/.test(problemNumber)) {
      alert("올바른 수를 입력해주세요.\n"); // 자연수 형식이 아닌 경우
      return;
    }

    if (maxProblemNumber === null) {
      alert("문제 수를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (parseInt(problemNumber, 10) < 1000 || parseInt(problemNumber, 10) > maxProblemNumber) {
      alert(`문제 번호는 1000 이상 ${maxProblemNumber} 이하이어야 합니다.`);
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
      console.error(error);
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
