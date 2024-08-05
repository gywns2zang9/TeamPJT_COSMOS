package S11P12A708.A708.domain.problem.service;

import S11P12A708.A708.common.util.BojProblem;
import S11P12A708.A708.common.util.CodeCrawler;
import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.repository.CodeRepository;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.problem.exception.ProblemNotExistException;
import S11P12A708.A708.domain.problem.exception.ProblemNotFoundException;
import S11P12A708.A708.domain.problem.exception.UserInfoNessaryException;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.problem.repository.ProblemUserRepository;
import S11P12A708.A708.domain.problem.request.CrawlCodeRequest;
import S11P12A708.A708.domain.problem.request.CreateProblemRequest;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.study.exception.StudyNotFoundException;
import S11P12A708.A708.domain.study.repository.StudyRepository;
import S11P12A708.A708.domain.study.service.StudyService;
import S11P12A708.A708.domain.team.entity.Team;
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

import static S11P12A708.A708.common.util.ProblemCrawler.getBojProblem;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final ProblemUserRepository problemUserRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

    private final StudyService studyService;

    private final CodeCrawler codeCrawler;
    private final CodeRepository codeRepository;

    public void createProblem(Long teamId, CreateProblemRequest req) {
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);

        final BojProblem crawledProblem = Optional.ofNullable(getBojProblem(req.getProblemNumber()))
                .orElseThrow(ProblemNotExistException::new);
        final Study study = studyRepository.findById(req.getStudyId()).orElseThrow(StudyNotFoundException::new);

        final Problem problem = Problem.of(crawledProblem, study);
        final Problem savedProblem = problemRepository.save(problem);

        // 스터디 폴더 내에 문제 이름으로 폴더 생성
        final Folder studyFolder = studyService.findStudyFolder(req.getStudyId());
        final Folder codeFolder = Folder.createCodeFolder(team, studyFolder, problem);
        studyFolder.addSubFolder(codeFolder);

        final List<User> teamUsers = teamQueryRepository.findUsersByTeamId(teamId);
        for (User user : teamUsers) {
            // 문제 폴더에 이름별로 폴더 생성
            final Folder individualCodeFolder = Folder.createIndividualCodeFolder(team, user, studyFolder, problem);
            codeFolder.addSubFolder(individualCodeFolder);

            // 이름별로 생성된 폴더에 파일 추가
            final Code code = codeCrawler.createByCrawler(user, req.getProblemNumber());
            codeRepository.save(code);

            individualCodeFolder.addFile(File.createCodeFile(user.getNickname() + "님의 풀이", user, individualCodeFolder, code));

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

//        String code = Optional.ofNullable(bojCrawl(user.getGitId(), user.getRepo(), problem.getNumber()))
//                .orElseThrow(CodeNotExistException::new);

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