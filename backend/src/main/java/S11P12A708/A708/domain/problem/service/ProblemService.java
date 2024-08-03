package S11P12A708.A708.domain.problem.service;

import S11P12A708.A708.common.util.BojProblem;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.problem.exception.ProblemNotExistException;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.problem.repository.ProblemUserRepository;
import S11P12A708.A708.domain.problem.request.CreateProblemRequest;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static S11P12A708.A708.common.util.ProblemCrawler.getBojProblem;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final ProblemUserRepository problemUserRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final TeamRepository teamRepository;

    public void createProblem(Long teamId, CreateProblemRequest req) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);

        final BojProblem crawledProblem = Optional.ofNullable(getBojProblem(req.getProblemNumber()))
                .orElseThrow(ProblemNotExistException::new);

        final Problem problem = Problem.of(crawledProblem);
        final Problem savedProblem = problemRepository.save(problem);

        final List<User> teamUsers = teamQueryRepository.findUsersByTeamId(teamId);
        for (User user : teamUsers) {
            // TODO: 문제 생성 후 관련한 폴더(사용자 별 폴더) 생성 필요
            // TODO: 문제에 대한 각 사용자의 코드 페이지(사용자 폴더에 생성되는 코드 페이지)를 생성 후 file 자리에 대입
            final ProblemUser problemUser = new ProblemUser(savedProblem, user, null);
            problemUserRepository.save(problemUser);
        }
    }

}