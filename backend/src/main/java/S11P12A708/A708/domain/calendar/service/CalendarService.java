package S11P12A708.A708.domain.calendar.service;

import S11P12A708.A708.domain.calendar.entity.Calendar;
import S11P12A708.A708.domain.calendar.exception.CalendarNotFoundException;
import S11P12A708.A708.domain.calendar.repository.CalendarRepository;
import S11P12A708.A708.domain.calendar.request.CalendarRequest;
import S11P12A708.A708.domain.calendar.response.CalendarResponse;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final TeamRepository teamRepository;

    public void createCalendar(final Long teamId, final CalendarRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Calendar calendar = requestToCalendar(team, request);
        calendarRepository.save(calendar);
    }

    public List<CalendarResponse> getCalendars(final Long teamId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final List<Calendar> calendars = calendarRepository.findByTeam(team);

        return calendars.stream().map(CalendarResponse::of).toList();
    }

    public void updateCalendar(final Long teamId, final Long calendarId, CalendarRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Calendar updateCalendar = requestToCalendar(team, request);
        Calendar calendar = calendarRepository.findById(calendarId).orElseThrow(CalendarNotFoundException::new);

        calendar.update(updateCalendar);
    }

    public void deleteCalendar(final Long teamId, final Long calendarId) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Calendar calendar = calendarRepository.findById(calendarId).orElseThrow(CalendarNotFoundException::new);

        calendarRepository.delete(calendar);
    }

    private Calendar requestToCalendar(final Team team, final CalendarRequest request) {
        return new Calendar(
                request.getTitle(),
                request.getMemo(),
                request.getTime(),
                team
        );
    }

}
