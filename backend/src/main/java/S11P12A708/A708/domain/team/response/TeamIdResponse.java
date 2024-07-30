package S11P12A708.A708.domain.team.response;

import S11P12A708.A708.domain.team.entity.Team;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TeamIdResponse {

    private final Long teamId;

    static public TeamIdResponse of(Team team) {
        return new TeamIdResponse(team.getId());
    }

}
