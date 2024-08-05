package S11P12A708.A708.domain.study.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudyCreateRequest {

    @NotNull
    private Integer year;

    @NotNull
    private Integer month;

}