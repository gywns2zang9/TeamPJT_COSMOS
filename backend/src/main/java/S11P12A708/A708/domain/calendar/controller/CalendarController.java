package S11P12A708.A708.domain.calendar.controller;

import S11P12A708.A708.domain.calendar.request.CalendarRequest;
import S11P12A708.A708.domain.calendar.response.CalendarResponse;
import S11P12A708.A708.domain.calendar.service.CalendarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @PostMapping("/teams/{teamId}/calendar")
    public ResponseEntity<Void> createCalendar(
            @PathVariable("teamId") Long teamId,
            @RequestBody CalendarRequest request) {
        calendarService.createCalendar(teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/calendars")
    public ResponseEntity<List<CalendarResponse>> getCalendars(@PathVariable("teamId") Long teamId) {
        final List<CalendarResponse> response = calendarService.getCalendars(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}/calendar/{calendarId}")
    public ResponseEntity<Void> updateCalendar(
            @PathVariable("teamId") Long teamId,
            @PathVariable("calendarId") Long calendarId,
            @RequestBody CalendarRequest request) {
        calendarService.updateCalendar(teamId, calendarId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/teams/{teamId}/calendar/{calendarId}")
    public ResponseEntity<Void> deleteCalendar(
            @PathVariable("teamId") Long teamId,
            @PathVariable("calendarId") Long calendarId) {
        calendarService.deleteCalendar(teamId, calendarId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}