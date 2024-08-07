package S11P12A708.A708.domain.code.response;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CodeYearFilterResponse {

    @NotNull
    Integer depth;

    @NotNull
    Integer year;

    List<CodeMonthFilterResponse> months;

    public CodeYearFilterResponse(Integer depth, Integer year) {
        this.depth = depth;
        this.year = year;
    }
}