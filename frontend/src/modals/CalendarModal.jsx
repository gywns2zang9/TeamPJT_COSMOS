import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CalendarModal = ({ 
    showModal, 
    setShowModal, 
    showDeleteModal, 
    setShowDeleteModal, 
    currentEvent, 
    setCurrentEvent, 
    isEditing, 
    handleSaveEvent, 
    handleDeleteEvent,
    setEvents,  // 캘린더 일정 상태를 업데이트하기 위한 콜백 추가
    events,     // 현재 일정 데이터
}) => {
    // 새로운 이벤트 상태 관리. currentEvent가 변경될 때마다 newEvent를 업데이트
    const [newEvent, setNewEvent] = useState(currentEvent);

    // currentEvent가 변경될 때 newEvent를 동기화
    useEffect(() => {
        setNewEvent(currentEvent);
    }, [currentEvent]);

    // 이벤트 삭제 핸들러
    const onDeleteEvent = async () => {
        try {
            await handleDeleteEvent();  // 부모 컴포넌트의 삭제 함수 호출

            // 삭제 후, 삭제된 이벤트를 제외한 이벤트 목록으로 상태 업데이트
            setEvents(events.filter(event => event.id !== currentEvent.id));

            setShowDeleteModal(false);
            setShowModal(false);
        } catch (error) {
            console.error('일정 삭제 실패', error);  // 오류 발생 시 콘솔에 출력
        }
    };

    return (
        <>
        {/* 일정 추가/수정 모달 */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>  {/* 수정 모드 여부에 따라 제목 변경 */}
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formEventTitle">
                <Form.Label>제목 (최대 20자)</Form.Label>
                <Form.Control
                    type="text"
                    maxLength={20}
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}  // 제목 변경 시 newEvent 업데이트
                />
                </Form.Group>
                <Form.Group controlId="formEventDescription">
                <Form.Label>내용 (최대 255자)</Form.Label>
                <Form.Control
                as="textarea"  // 내용 부분을 textarea로 변경
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                maxLength={255}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}  // 설명 변경 시 newEvent 업데이트
                />
                </Form.Group>
                <Form.Group controlId="formEventStart">
                <Form.Label>시작 시간</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}  // 시작 시간 변경 시 newEvent 업데이트
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            {isEditing && (
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                    삭제  {/* 수정 모드일 때만 삭제 버튼 표시 */}
                </Button>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                취소  {/* 취소 버튼 클릭 시 모달 닫기 */}
            </Button>
            <Button variant="primary" onClick={() => {
                setCurrentEvent(newEvent);  // 부모 컴포넌트로 newEvent를 올려보냄
                handleSaveEvent(newEvent);  // newEvent를 인자로 전달하여 저장 로직 실행
                setShowModal(false);        // 모달 닫기
            }}>
                저장
            </Button>
            </Modal.Footer>
        </Modal>

        {/* 삭제 확인 모달 */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>일정 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            정말 삭제하시겠습니까?  {/* 삭제 확인 메시지 */}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                취소  {/* 취소 버튼 클릭 시 삭제 모달 닫기 */}
            </Button>
            <Button variant="danger" onClick={onDeleteEvent}>
                삭제  {/* 삭제 버튼 클릭 시 onDeleteEvent 호출 */}
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default CalendarModal;
