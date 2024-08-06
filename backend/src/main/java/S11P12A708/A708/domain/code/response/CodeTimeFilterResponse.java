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
public class CodeTimeFilterResponse {

    @NotNull
    Integer depth;

    @NotNull
    Integer time;

    @NotNull
    Long studyId;

    List<CodeFilterResponse> codes;

    public CodeTimeFilterResponse(Integer depth, Long studyId, Integer time) {
        this.studyId = studyId;
        this.depth = depth;
        this.time = time;
    }

}