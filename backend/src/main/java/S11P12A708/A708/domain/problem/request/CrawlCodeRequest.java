package S11P12A708.A708.domain.problem.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CrawlCodeRequest {

    @NotNull
    Long userId;

    @NotNull
    Long problemId;
}