import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import '../../css/group/calendar.css';
import { Modal, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const handleDateClick = (date) => {
    setNewEvent({ title: '', start: date.dateStr, description: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setNewEvent({
      title: event.title,
      start: event.startStr,
      description: event.extendedProps.description || ''
    });
    setCurrentEventId(event.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    const eventToSave = {
      ...newEvent,
      end: newEvent.start // 종료 시간을 시작 시간과 동일하게 설정
    };

    if (isEditing) {
      setEvents(events.map(event => 
        event.id === currentEventId ? { ...eventToSave, id: currentEventId } : event
      ));
    } else {
      setEvents([...events, { ...eventToSave, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setNewEvent({ title: '', start: '', description: '' });
  };

  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        {eventInfo.view.type !== 'dayGridMonth' && <i>{eventInfo.event.title}</i>}
      </div>
    );
  };

  const renderDayCellContent = (dayCellContent) => {
    return (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id={`tooltip-${dayCellContent.date.toISOString()}`}>일정 추가</Tooltip>}
      >
        <div
          className="fc-daygrid-day-number"
          onClick={(e) => {
            e.stopPropagation(); 
            handleDateClick(dayCellContent.date);
          }}
        >
          {dayCellContent.dayNumberText}
        </div>
      </OverlayTrigger>
    );
  };

  return (
    <div className="fullcalendar-wrapper">
      <FullCalendar
        plugins={plugins}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{ 
          left: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay today,addEventButton"
        }}
        customButtons={{
          addEventButton: {
            text: '+',
            click: () => {
              setNewEvent({ title: '', start: '', description: '' });
              setIsEditing(false);
              setShowModal(true);
            }
          }
        }}
        footerToolbar={{
          left: "prev",
          center: "",
          right: "next"
        }}
        buttonText={{
          today: "오늘",
          month: "월별",
          week: "주별",
          day: "일별",
          list: "리스트"
        }}
        dateClick={(e) => e.jsEvent.stopPropagation()} 
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        expandRows={true}
        dayMaxEventRows={false} 
        dayMaxEvents={false}
        dayCellContent={renderDayCellContent} 
      />

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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
