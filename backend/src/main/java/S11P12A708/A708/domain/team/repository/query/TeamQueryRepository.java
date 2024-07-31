package S11P12A708.A708.domain.team.repository.query;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.user.entity.User;

import java.util.List;
import java.util.Optional;


public interface TeamQueryRepository {

    Optional<List<Team>> findTeamsByUserId(Long userId);

    List<User> findUsersByTeamId(Long TeamId);

    TeamUser findLeaderUserByTeamId(Long TeamId);

    TeamUser findTeamUserByIds(Long teamId, Long userId);
}
