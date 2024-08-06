// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';

// const CalendarModal = ({ 
//     showModal, 
//     setShowModal, 
//     showDeleteModal, 
//     setShowDeleteModal, 
//     currentEvent, 
//     setCurrentEvent, 
//     isEditing, 
//     handleSaveEvent, 
//     handleDeleteEvent 
// }) => {
//     const [newEvent, setNewEvent] = useState(currentEvent);

//     useEffect(() => {
//         setNewEvent(currentEvent);
//     }, [currentEvent]);

//     return (
//         <>
//         {/* 일정 모달 */}
//         <Modal show={showModal} onHide={() => setShowModal(false)}>
//             <Modal.Header closeButton>
//             <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//             <Form>
//                 <Form.Group controlId="formEventTitle">
//                 <Form.Label>제목</Form.Label>
//                 <Form.Control
//                     type="text"
//                     value={newEvent.title}
//                     onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                 />
//                 </Form.Group>
//                 <Form.Group controlId="formEventDescription">
//                 <Form.Label>내용</Form.Label>
//                 <Form.Control
//                     type="text"
//                     value={newEvent.description}
//                     onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//                 />
//                 </Form.Group>
//                 <Form.Group controlId="formEventStart">
//                 <Form.Label>시작 시간</Form.Label>
//                 <Form.Control
//                     type="datetime-local"
//                     value={newEvent.start}
//                     onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
//                 />
//                 </Form.Group>
//             </Form>
//             </Modal.Body>
//             <Modal.Footer>
//             {isEditing && (
//                 <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
//                     삭제
//                 </Button>
//             )}
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//                 취소
//             </Button>
//             <Button variant="primary" onClick={() => {
//                 setCurrentEvent(newEvent);
//                 handleSaveEvent();
//             }}>
//                 저장
//             </Button>
//             </Modal.Footer>
//         </Modal>

//         {/* 삭제 모달 */}
//         <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//             <Modal.Header closeButton>
//             <Modal.Title>일정 삭제</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//             정말 삭제하시겠습니까?
//             </Modal.Body>
//             <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//                 취소
//             </Button>
//             <Button variant="danger" onClick={handleDeleteEvent}>
//                 삭제
//             </Button>
//             </Modal.Footer>
//         </Modal>
//         </>
//     );
// };

// export default CalendarModal;

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
    const [newEvent, setNewEvent] = useState(currentEvent);

    useEffect(() => {
        setNewEvent(currentEvent);
    }, [currentEvent]);

    const onDeleteEvent = async () => {
        try {
            await handleDeleteEvent();  // 삭제 작업 수행

            // 삭제 후 상태 업데이트 (필요한 경우 특정 ID로 일정을 찾고 제거)
            setEvents(events.filter(event => event.id !== currentEvent.id));

            // 모달 닫기
            setShowDeleteModal(false);
            setShowModal(false);
        } catch (error) {
            console.error('일정 삭제 실패', error);
        }
    };

    return (
        <>
        {/* 일정 모달 */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formEventTitle">
                <Form.Label>제목</Form.Label>
                <Form.Control
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                </Form.Group>
                <Form.Group controlId="formEventDescription">
                <Form.Label>내용</Form.Label>
                <Form.Control
                    type="text"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
                </Form.Group>
                <Form.Group controlId="formEventStart">
                <Form.Label>시작 시간</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            {isEditing && (
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                    삭제
                </Button>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                취소
            </Button>
            <Button variant="primary" onClick={() => {
                setCurrentEvent(newEvent);
                handleSaveEvent();
            }}>
                저장
            </Button>
            </Modal.Footer>
        </Modal>

        {/* 삭제 모달 */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>일정 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            정말 삭제하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                취소
            </Button>
            <Button variant="danger" onClick={onDeleteEvent}>
                삭제
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default CalendarModal;

