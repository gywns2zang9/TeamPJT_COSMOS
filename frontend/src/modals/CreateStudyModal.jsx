import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import useGroupStore from '../store/group';
import { useLocation } from 'react-router-dom';

function CreateStudyModal({ show, handleClose, groupId }) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const createStudyOverview = useGroupStore(state => state.createStudy);

    const handleCloseModal = () => {
        setYear(currentYear);
        setMonth(currentMonth);
        handleClose();
    }
    const handleCreateStudy = () => {
        const createStudy = async () => {
            const response = await createStudyOverview({ groupId, year, month });
            console.log(response);
            window.location.reload();
        }
        createStudy();
        handleCloseModal()
    };

    const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>스터디 생성하기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="studyYear">
                        <Form.Label>년도</Form.Label>
                        <Form.Control
                            as="select"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        >
                            {years.map((yr) => (
                                <option key={yr} value={yr} style={{ backgroundColor: "#ffffff", color: "#495057"}}>
                                    {yr}년
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="studyMonth" className="mt-3">
                        <Form.Label>월</Form.Label>
                        <Form.Control
                            as="select"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        >
                            {months.map((mn) => (
                                <option key={mn} value={mn} style={{ backgroundColor: "#ffffff", color: "#495057"}}>
                                    {mn}월
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleCreateStudy}>
                    생성하기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateStudyModal;