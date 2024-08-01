package S11P12A708.A708.domain.calendar.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class CalendarTimeFormatException extends BusinessException {

    public CalendarTimeFormatException() {
        super(ErrorCode.CALENDAR_TIME_FORMAT);
    }

}