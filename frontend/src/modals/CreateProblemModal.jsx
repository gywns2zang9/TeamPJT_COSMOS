import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import useGroupStore from '../store/group';

function CreateProblemModal({ show, handleClose, groupId, studyId }) {
    const [problemSite, setProblemSite] = useState('');
    const [problemNumber, setProblemNumber] = useState('');
    const createProblem = useGroupStore((state) => state.createProblem)
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Site: ${problemSite}, Number: ${problemNumber}`);
        // TODO: API 요청 (problemSite, problemNumber)
        createProblem({ groupId, problemNumber, studyId });
        handleClose();
    };



    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>문제 추가하기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="problemSite">
                        <Form.Label>문제 사이트</Form.Label>
                        <Form.Control as="select" value={problemSite} onChange={(e) =>setProblemSite(e.target.value)}>
                            <option value="">사이트를 선택하세요</option>
                            <option value="baekjoon">백준</option>
                            <option value="programmers">프로그래머스</option>
                            <option value="swea">스웨아</option>
                            <option value="etc">기타</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="problemNumber" style={{ marginTop: '1rem' }}>
                        <Form.Label>문제 번호</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="문제 번호를 입력하세요" 
                            value={problemNumber} 
                            onChange={(e) => setProblemNumber(e.target.value)} 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ marginTop: '1rem' }}>
                        제출
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateProblemModal;
