package S11P12A708.A708.domain.team.response;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.user.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class TeamDetailResponse {

    private final Long id;
    private final String name;
    private final String description;
    private final List<TeamMemberResponse> members;

    static public TeamDetailResponse of(Team team, List<User> users) {
        return new TeamDetailResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                users.stream().map(TeamMemberResponse::of).toList());
    }

}