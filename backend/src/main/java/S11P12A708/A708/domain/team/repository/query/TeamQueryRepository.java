package S11P12A708.A708.domain.team.repository.query;

import S11P12A708.A708.domain.team.entity.Team;

import java.util.List;
import java.util.Optional;


public interface TeamQueryRepository {

    Optional<List<Team>> findTeamsByUserId(Long userId);

}
