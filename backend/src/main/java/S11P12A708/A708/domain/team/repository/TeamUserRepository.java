package S11P12A708.A708.domain.team.repository;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamUserRepository extends JpaRepository<TeamUser, Long> {
    TeamUser findByTeamAndUser(Team team, User user);
}
