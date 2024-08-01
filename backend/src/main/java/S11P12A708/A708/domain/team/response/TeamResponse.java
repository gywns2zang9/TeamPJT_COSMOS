package S11P12A708.A708.domain.team.response;

import S11P12A708.A708.domain.team.entity.Team;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TeamResponse {

    private final Long id;
    private final String name;
    private final String description;

    static public TeamResponse of(Team team) {
        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription());
    }

}
