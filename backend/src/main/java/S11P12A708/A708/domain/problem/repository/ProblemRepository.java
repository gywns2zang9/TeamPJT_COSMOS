package S11P12A708.A708.domain.problem.repository;

import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.study.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByStudy(Study study);
}
