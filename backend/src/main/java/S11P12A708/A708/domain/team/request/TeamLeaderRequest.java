package S11P12A708.A708.domain.team.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TeamLeaderRequest {

    @NotBlank
    private Long userId;

}