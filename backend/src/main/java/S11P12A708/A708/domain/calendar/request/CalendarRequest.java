package S11P12A708.A708.domain.calendar.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CalendarRequest {

    @NotBlank
    private String title;

    private String memo;

    @NotBlank
    private LocalDate time;

}