package S11P12A708.A708.domain.calendar.response;

import S11P12A708.A708.domain.calendar.entity.Calendar;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.format.DateTimeFormatter;

@Getter
@RequiredArgsConstructor
public class CalendarResponse {
    private final Long calendarId;
    private final String title;
    private final String memo;
    private final String time;

    static public CalendarResponse of(Calendar calendar, DateTimeFormatter formatter) {
        return new CalendarResponse(
                calendar.getId(),
                calendar.getTitle(),
                calendar.getMemo(),
                calendar.getTime().format(formatter)
        );
    }
}
