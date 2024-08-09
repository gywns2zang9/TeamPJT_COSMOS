import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import '../../../css/group/calendar.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useGroupStore from '../../../store/group';
import CalendarModal from '../../../modals/CalendarModal.jsx';

function Calendar({ groupId }) {
  const { loadCalendarScheduleList, createCalendarSchedule, updateCalendarSchedule, deleteCalendarSchedule } = useGroupStore();
  const [events, setEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', start: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await loadCalendarScheduleList({ groupId })
        const formattedEvents = response.map(event => ({
          id: event.calendarId,
          title: event.title,
          start: new Date(event.time).toISOString().slice(0, -1),
          description: event.memo
        }))
        setEvents(formattedEvents);
      } catch (err) {
        console.error('일정 불러오기 실패 -> ', err);
      }
    };
    fetchEvents();
  }, [groupId, loadCalendarScheduleList]);

  const handleDateClick = (date) => {
    setCurrentEvent({ title: '', start: date.dateStr, description: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setCurrentEvent({
      title: event.title,
      start: event.startStr,
      description: event.extendedProps.description || ''
    });
    setCurrentEventId(event.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const formatDateToMySQL = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSaveEvent = async () => {
    try {
      const eventDate = currentEvent.start
      const formattedDate = formatDateToMySQL(eventDate);
      if (isEditing) {
        await updateCalendarSchedule({
          groupId,
          calendarId: currentEventId,
          title: currentEvent.title,
          memo: currentEvent.description,
          time: formattedDate
        });
        setEvents(events.map(event =>
          event.id === currentEventId ? { ...currentEvent, id: currentEventId, start: formattedDate } : event
        ));
      } else {
        const response = await createCalendarSchedule({
          groupId,
          title: currentEvent.title,
          memo: currentEvent.description,
          time: formattedDate
        });
        setEvents([...events, { ...currentEvent, id: response.calendarId, start: formattedDate }]);
      }
      window.location.reload();
      setShowModal(false);
      setCurrentEvent({ title: '', start: '', description: '' });
    } catch (err) {
      console.error('일정 저장 실패', err);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      console.log(currentEvent);
      await deleteCalendarSchedule({ groupId, calendarId: currentEventId });
      window.location.reload();
      setShowDeleteModal(false);
      setShowModal(false);
    } catch (err) {
      console.error('일정 삭제 실패', err);
    }
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
              setCurrentEvent({ title: '', start: '', description: '' });
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

      <CalendarModal
        showModal={showModal}
        setShowModal={setShowModal}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        isEditing={isEditing}
        handleSaveEvent={handleSaveEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
}

export default Calendar;
