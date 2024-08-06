package S11P12A708.A708.domain.study.repository;

import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {


    List<Study> findByTeam(Team team);
}
