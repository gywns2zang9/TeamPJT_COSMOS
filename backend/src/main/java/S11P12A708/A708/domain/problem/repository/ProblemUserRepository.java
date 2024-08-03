package S11P12A708.A708.domain.problem.repository;

import S11P12A708.A708.domain.problem.entity.ProblemUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemUserRepository extends JpaRepository<ProblemUser, Long> {
}
