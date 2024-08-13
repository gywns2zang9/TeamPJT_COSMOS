package S11P12A708.A708.domain.problem.service;

import S11P12A708.A708.common.util.BojProblem;
import S11P12A708.A708.common.util.CodeCrawler;
import S11P12A708.A708.common.util.ProblemStatus;
import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.repository.CodeRepository;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.folder.service.FolderService;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.problem.exception.ProblemNotExistException;
import S11P12A708.A708.domain.problem.exception.ProblemNotFoundException;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.problem.repository.ProblemUserRepository;
import S11P12A708.A708.domain.problem.request.CrawlCodeRequest;
import S11P12A708.A708.domain.problem.request.CreateProblemRequest;
import S11P12A708.A708.domain.problem.request.DeleteProblemRequest;
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
    private final FolderService folderService;
    private final FolderRepository folderRepository;

    public void createProblem(Long teamId, CreateProblemRequest req) {
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);

        final BojProblem crawledProblem = Optional.ofNullable(getBojProblem(req.getProblemNumber()))
                .orElseThrow(ProblemNotExistException::new);
        final Study study = studyRepository.findById(req.getStudyId()).orElseThrow(StudyNotFoundException::new);

        final Problem problem = Problem.of(crawledProblem, study);
        final Problem savedProblem = problemRepository.save(problem);

        // 스터디 폴더 내에 문제 이름으로 폴더 생성
        final Folder studyFolder = studyService.findStudyFolder(teamId, req.getStudyId());
        final Folder problemFolder = Folder.createProblemFolder(team, studyFolder, problem);
        studyFolder.addSubFolder(problemFolder);

        final List<User> teamUsers = teamQueryRepository.findUsersByTeamId(teamId);
        for (User user : teamUsers) {
            // 문제 폴더에 이름별로 폴더 생성
            final Folder individualCodeFolder = Folder.createIndividualCodeFolder(team, user, studyFolder, problem);
            problemFolder.addSubFolder(individualCodeFolder);

            // 이름별로 생성된 폴더에 파일 추가
            final Code code = codeCrawler.createByCrawler(user, req.getProblemNumber());
            codeRepository.save(code);

            final File UserCodeFile  = File.createCodeFile(user, individualCodeFolder, code);
            individualCodeFolder.addFile(UserCodeFile);

            final ProblemUser problemUser = new ProblemUser(savedProblem, user, UserCodeFile);
            if (ProblemStatus.check(user.getGitId(), problem.getNumber())) problemUser.updateStatus();
            problemUserRepository.save(problemUser);
        }
    }

    @Transactional
    public void deleteProblem(Long teamId, Long problemId, DeleteProblemRequest request) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Problem problem =  problemRepository.findById(problemId).orElseThrow(ProblemNotFoundException::new);

        problemUserRepository.deleteByProblem(problem);

        Folder studyFolder = studyService.findStudyFolder(teamId, request.getStudyId());
        Folder problemFolder = studyFolder.getSubFolders().stream()
                .filter(subFolder -> problem.getName().equals(subFolder.getName()))
                .findFirst()
                .orElseThrow(FolderNotFoundException::new);

        folderRepository.delete(problemFolder);
        studyFolder.removeSubFolder(problemFolder);

        problemRepository.delete(problem);
    }

    public void crawlCode(Long teamId, CrawlCodeRequest req) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final User user = userRepository.findById(req.getUserId()).orElseThrow(UserNotFoundException::new);
        final Problem problem = problemRepository.findById(req.getProblemId()).orElseThrow(ProblemNotFoundException::new);

        // 업데이트할 코드 가져오기
        final Code newCode = codeCrawler.createByCrawler(user, problem.getNumber());
        if(newCode.getContent().isEmpty()) return; // 업데이트할 코드가 없다면 업데이트 하지 않음

        final ProblemUser problemUser = problemUserRepository.findByProblemAndUser(problem, user);
        final Code code = problemUser.getFile().getCode();

        code.update(newCode);
        codeRepository.save(code);

        if (ProblemStatus.check(user.getGitId(), problem.getNumber())) problemUser.updateStatus();
    }

}