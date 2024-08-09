import React from 'react';
import { Modal, Button, Accordion } from 'react-bootstrap';

const MyCodeListModal = ({ show, handleClose, personalCodeList, loadCode }) => {

    const clickCode = (code) => {
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
                                    <Accordion>
                                        {year.months.map((month, monthIndex) => (
                                            <Accordion.Item eventKey={`${yearIndex}-${monthIndex}`} key={`${yearIndex}-${monthIndex}`}>
                                                <Accordion.Header>{month.month}월</Accordion.Header>
                                                <Accordion.Body>
                                                    <Accordion>
                                                        {month.times.map((time, timeIndex) => (
                                                            <Accordion.Item eventKey={`${yearIndex}-${monthIndex}-${timeIndex}`} key={`${yearIndex}-${monthIndex}-${timeIndex}`}>
                                                                <Accordion.Header>{time.time}회차</Accordion.Header>
                                                                <Accordion.Body>
                                                                    <ul>
                                                                        {time.codes.map((code) => (
                                                                            <li key={code.codeId} onClick={() => clickCode(code)}>
                                                                                {code.problemName} - {code.fileName} - {code.codeId}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        ))}
                                                    </Accordion>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <p>코드 목록이 없습니다.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MyCodeListModal;
