package S11P12A708.A708.domain.team.repository;

import S11P12A708.A708.domain.team.entity.TeamUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamUserRepository extends JpaRepository<TeamUser, Long> {
}
