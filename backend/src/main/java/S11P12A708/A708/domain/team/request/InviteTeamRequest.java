package S11P12A708.A708.domain.team.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class InviteTeamRequest {

    @NotEmpty
    private String[] emails;

}
