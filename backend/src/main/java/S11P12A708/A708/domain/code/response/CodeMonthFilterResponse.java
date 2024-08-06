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
public class CodeMonthFilterResponse {

    @NotNull
    Integer depth;

    @NotNull
    Integer month;

    List<CodeTimeFilterResponse> times;

    public CodeMonthFilterResponse(Integer depth, Integer month) {
        this.depth = depth;
        this.month = month;
    }
}