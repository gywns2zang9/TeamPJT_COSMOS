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
  // 그룹 스토어에서 일정 관련 함수를 가져옴
  const { loadCalendarScheduleList, createCalendarSchedule, updateCalendarSchedule, deleteCalendarSchedule } = useGroupStore();
  
  // 이벤트 데이터, 모달 상태, 현재 선택된 이벤트 등을 관리하는 state 선언
  const [events, setEvents] = useState([]); // 캘린더에 표시될 이벤트들
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달 표시 여부
  const [showModal, setShowModal] = useState(false); // 일정 추가/수정 모달 표시 여부
  const [currentEvent, setCurrentEvent] = useState({ title: '', start: '', description: '' }); // 현재 작업 중인 이벤트
  const [isEditing, setIsEditing] = useState(false); // 현재 작업이 수정인지 여부를 나타냄
  const [currentEventId, setCurrentEventId] = useState(null); // 현재 수정 중인 이벤트의 ID

  // 컴포넌트가 처음 마운트될 때 및 groupId가 변경될 때 일정을 불러옴
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await loadCalendarScheduleList({ groupId });
        // API 응답을 캘린더에서 사용하는 이벤트 형식으로 변환
        const formattedEvents = response.map(groupEvent => ({
          id: groupEvent.calendarId,
          title: groupEvent.title,
          start: groupEvent.time,
          description: groupEvent.memo
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error('일정 불러오기 실패 -> ', err);
      }
    };
    fetchEvents();
  }, [groupId, loadCalendarScheduleList]);

  // 날짜를 ISO 8601 형식으로 변환하는 함수
  const formatDateToISOString = (date) => {
    const year = date.getFullYear(); // 연도 추출
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 추출 (0부터 시작하므로 +1), 두 자리로 맞춤
    const day = String(date.getDate()).padStart(2, '0'); // 일 추출, 두 자리로 맞춤
    const hours = String(date.getHours()).padStart(2, '0'); // 시간 추출, 두 자리로 맞춤
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 분 추출, 두 자리로 맞춤
    return `${year}-${month}-${day}T${hours}:${minutes}`; // ISO 8601 형식으로 조합
  };

  // ISO 8601 형식의 날짜를 MySQL에서 사용하는 형식으로 변환하는 함수
  const formatDateToMySQL = (isoDate) => {
    const [datePart, timePart] = isoDate.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 사용자가 날짜를 클릭했을 때 새로운 이벤트를 추가할 수 있는 모달을 표시
  const handleDateClick = (date) => {
    // 선택한 날짜를 ISO 8601 형식으로 변환
    const dateStart = formatDateToISOString(date);
    // 이벤트 상태 초기화
    setCurrentEvent({ title: '', start: dateStart, description: '' });
    setIsEditing(false); // 새 이벤트 추가 모드로 설정
    setShowModal(true); // 모달 표시
  };

  // 사용자가 기존 이벤트를 클릭했을 때 이벤트 수정 모달을 표시
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const eventStart = formatDateToISOString(event.start);
    setCurrentEvent({
      title: event.title,
      start: eventStart,
      description: event.extendedProps.description || ''
    });
    setCurrentEventId(event.id); // 수정할 이벤트의 ID 설정
    setIsEditing(true); // 이벤트 수정 모드로 설정
    setShowModal(true); // 모달 표시
  };
  
  // 이벤트 저장(추가/수정) 시 호출되는 함수
  const handleSaveEvent = async (event) => {
      // title 또는 description이 비어 있는지 확인
    if (!event.title || !event.description) {
      window.alert('제목과 설명을 모두 입력해주세요.');
      return; // 함수 종료
    }

    try {
      const formattedDate = formatDateToMySQL(event.start);

      if (isEditing) {
        // 기존 이벤트를 수정하는 경우
        await updateCalendarSchedule({
          groupId,
          calendarId: currentEventId,
          title: event.title,
          memo: event.description,
          time: formattedDate
        });
        // 상태 업데이트로 수정된 이벤트 반영
        setEvents(events.map(event =>
          event.id === currentEventId ? { ...event, id: currentEventId, start: formattedDate } : event
        ));

      } else {
        // 새로운 이벤트를 추가하는 경우
        const response = await createCalendarSchedule({
          groupId,
          title: event.title,
          memo: event.description,
          time: formattedDate
        });
        // 상태 업데이트로 새 이벤트 반영
        setEvents([...events, { ...event, id: response.calendarId, start: formattedDate }]);
      }
      window.location.reload();
      setShowModal(false);
      setCurrentEvent({ title: '', start: '', description: '' });
    } catch (err) {
      console.error('일정 저장 실패', err);
    }
  };

  // 이벤트 삭제 시 호출되는 함수
  const handleDeleteEvent = async () => {
    try {
      await deleteCalendarSchedule({ groupId, calendarId: currentEventId });
      window.location.reload(); // 페이지 새로고침
      setShowDeleteModal(false); // 삭제 모달 닫기
      setShowModal(false); // 이벤트 모달 닫기
    } catch (err) {
      console.error('일정 삭제 실패', err);
    }
  };

  // FullCalendar에 필요한 플러그인 설정
  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  // 이벤트를 캘린더에 렌더링할 때의 UI를 정의하는 함수
  const renderEventContent = (eventInfo) => {
    const convertTo24HourFormat = (timeText) => {
      if (timeText.includes('p')) { // 'p'가 포함된 경우 (오후)
        let [time, minutes] = timeText.replace('p', '').split(':');
        time = parseInt(time, 10) + 12; // 12시간 더하기
  
        // 분이 없으면 기본값으로 "00"을 설정
        if (!minutes) {
          minutes = '00';
        }
        
        return `${time}:${minutes}`;
      } else if (timeText.includes('a')) { // 'a'가 포함된 경우 (오전)
        let [time, minutes] = timeText.replace('a', '').split(':');
  
        // 분이 없으면 기본값으로 "00"을 설정
        if (!minutes) {
          minutes = '00';
        }
  
        return `${time}:${minutes}`;
      }
      return timeText; // 'a'나 'p'가 없는 경우 그대로 반환
    };
  
    const eventTime = convertTo24HourFormat(eventInfo.timeText);
    return (
      <div style={{ cursor: 'pointer' }}> {/* 커서 스타일을 포인터로 설정 */}
        <b style={{
          display: 'inline-block',
          maxWidth: '90%',      /* 너비를 설정합니다. 필요에 따라 특정 px 또는 %로 설정 */
          whiteSpace: 'nowrap',  /* 텍스트를 한 줄로 표시하고 줄바꿈을 방지합니다 */
          overflow: 'hidden',    /* 넘치는 내용을 숨깁니다 */
          textOverflow: 'ellipsis'  /* 넘치는 텍스트에 ...을 표시합니다 */
        }}>
          {eventInfo.event.title}
        </b>
        <p>({eventTime})</p>
        {eventInfo.view.type !== 'dayGridMonth' && <i>{eventInfo.event.title}</i>}
      </div>
    );
  };

  // 날짜 셀의 내용을 렌더링할 때 사용하는 함수
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
            handleDateClick(dayCellContent.date); // 날짜 클릭 시 이벤트 추가 모달 열기
          }}
        >
          {dayCellContent.dayNumberText}
        </div>
      </OverlayTrigger>
    );
  };

  return (
    <div className="fullcalendar-wrapper">
      {/* FullCalendar 컴포넌트 */}
      <FullCalendar
        plugins={plugins} // 플러그인 설정
        initialView="dayGridMonth" // 월별 뷰로 고정
        events={events} // 캘린더에 표시될 이벤트 목록
        headerToolbar={{
          left: "prev,next today", // 왼쪽에 이전, 다음, 오늘 버튼
          center: "title", // 중앙에 타이틀 표시
          right: "addEventButton" // 주별, 일별 보기 버튼 제거
        }}
        customButtons={{
          addEventButton: {
            text: '+',
            click: () => {
              setCurrentEvent({ title: '', start: '', description: '' }); // 빈 이벤트로 초기화
              setIsEditing(false); // 이벤트 추가 모드로 설정
              setShowModal(true); // 모달 표시
            }
          }
        }}
        buttonText={{
          today: "오늘", // 오늘 버튼 텍스트
          month: "월별" // 월별 버튼 텍스트
        }}
        dateClick={(e) => e.jsEvent.stopPropagation()} // 날짜 클릭 시 이벤트 전파 방지
        eventClick={handleEventClick} // 이벤트 클릭 시 수정 모달 열기
        eventContent={renderEventContent} // 이벤트 렌더링 커스터마이징
        expandRows={true} // 행 확장
        dayMaxEventRows={false} // 최대 이벤트 행 수 제한 해제
        dayMaxEvents={false} // 최대 이벤트 수 제한 해제
        dayCellContent={renderDayCellContent} // 날짜 셀 콘텐츠 렌더링
        
      />

      {/* 일정 추가/수정 및 삭제 모달 */}
      <CalendarModal
        showModal={showModal} // 모달 표시 여부
        setShowModal={setShowModal} // 모달 표시 상태 변경 함수
        showDeleteModal={showDeleteModal} // 삭제 모달 표시 여부
        setShowDeleteModal={setShowDeleteModal} // 삭제 모달 표시 상태 변경 함수
        currentEvent={currentEvent} // 현재 작업 중인 이벤트
        setCurrentEvent={setCurrentEvent} // 현재 이벤트 상태 변경 함수
        isEditing={isEditing} // 수정 모드 여부
        handleSaveEvent={handleSaveEvent} // 이벤트 저장 핸들러
        handleDeleteEvent={handleDeleteEvent} // 이벤트 삭제 핸들러
      />
    </div>
  );
}

export default Calendar;
