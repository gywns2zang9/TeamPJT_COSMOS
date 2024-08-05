package S11P12A708.A708.domain.team.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TeamInfoRequest {

    @NotBlank
    private String groupName;

    @NotBlank
    private String description;

}