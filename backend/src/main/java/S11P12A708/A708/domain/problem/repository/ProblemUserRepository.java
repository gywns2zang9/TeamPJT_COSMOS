package S11P12A708.A708.domain.problem.repository;

import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemUserRepository extends JpaRepository<ProblemUser, Long> {

    ProblemUser findByProblemAndUser(Problem problem, User user);

    void deleteByProblem(Problem problem);

}