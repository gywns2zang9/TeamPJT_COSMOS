package S11P12A708.A708.domain.problem.service;

import S11P12A708.A708.common.util.BojProblem;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.problem.exception.CodeNotExistException;
import S11P12A708.A708.domain.problem.exception.ProblemNotExistException;
import S11P12A708.A708.domain.problem.exception.ProblemNotFoundException;
import S11P12A708.A708.domain.problem.exception.UserInfoNessaryException;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.problem.repository.ProblemUserRepository;
import S11P12A708.A708.domain.problem.request.CrawlCodeRequest;
import S11P12A708.A708.domain.problem.request.CreateProblemRequest;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static S11P12A708.A708.common.util.CodeCrawler.bojCrawl;
import static S11P12A708.A708.common.util.ProblemCrawler.getBojProblem;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final ProblemUserRepository problemUserRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

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

    @Transactional
    public void deleteProblem(Long teamId, Long problemId) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Problem problem =  problemRepository.findById(problemId).orElseThrow(ProblemNotFoundException::new);

        final List<User> teamUsers = teamQueryRepository.findUsersByTeamId(teamId);
        for (User user : teamUsers) {
            // TODO: user가 포함된 파일(folder, user 이용) 및 폴더(user, problem 이용) 삭제 필요
        }
        problemUserRepository.deleteByProblem(problem);
        problemRepository.delete(problem);
    }

    public void crawlCode(Long teamId, CrawlCodeRequest req) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final User user = userRepository.findById(req.getUserId()).orElseThrow(UserNotFoundException::new);
        final Problem problem = problemRepository.findById(req.getProblemId()).orElseThrow(ProblemNotFoundException::new);

        checkUserInfoForCrawling(user);

        String code = Optional.ofNullable(bojCrawl(user.getGitId(), user.getRepo(), problem.getNumber()))
                .orElseThrow(CodeNotExistException::new);

        // TODO: 갖고 온 코드를 코드 페이지에 저장 필요
        // TODO: 코드 뿐만 아니라, 해당 README.md 도 같이 저장되었으면 어떨지 논의 필요
    }

    private void checkUserInfoForCrawling(User user) {
        if ((user.getGitId() == null || user.getGitId().isEmpty()) ||
                (user.getRepo() == null || user.getRepo().isEmpty())) {
            throw new UserInfoNessaryException();
        }
    }
}