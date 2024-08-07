package S11P12A708.A708.domain.problem.repository;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProblemUserRepository extends JpaRepository<ProblemUser, Long> {

    ProblemUser findByProblemAndUser(Problem problem, User user);
    List<ProblemUser> findByUser(User user);
    void deleteByProblem(Problem problem);
    Optional<ProblemUser> findProblemUserByFile(File file);

}
