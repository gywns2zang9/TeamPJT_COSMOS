import React from 'react';
import { Modal, Button, Accordion, ListGroup } from 'react-bootstrap';

const MyCodeListModal = ({ show, handleClose, personalCodeList, loadCode, setProblemName }) => {

    const clickCode = (code) => {
        setProblemName(code.problemName);
        loadCode({ codeId: code.codeId });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>내 코드 목록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Array.isArray(personalCodeList) && personalCodeList.length > 0 ? (
                    <Accordion>
                        {personalCodeList.map((year, yearIndex) => (
                            <Accordion.Item eventKey={`${yearIndex}`} key={yearIndex}>
                                <Accordion.Header>{year.year}년</Accordion.Header>
                                <Accordion.Body>
                                    {year.months.map((month, monthIndex) => (
                                        <div key={`${yearIndex}-${monthIndex}`}>
                                            <h6>{month.month}월</h6>
                                            <ListGroup>
                                                {month.times.map((time, timeIndex) => (
                                                    <ListGroup.Item key={`${yearIndex}-${monthIndex}-${timeIndex}`}>
                                                        <strong>{time.time}회차</strong>
                                                        <ListGroup variant="flush">
                                                            {time.codes.map((code) => (
                                                                <ListGroup.Item 
                                                                    key={code.codeId} 
                                                                    action 
                                                                    onClick={() => clickCode(code)}
                                                                >
                                                                    {code.problemName}
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <p>코드 목록이 없습니다.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} style={{ backgroundColor:'inherit'}}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MyCodeListModal;
