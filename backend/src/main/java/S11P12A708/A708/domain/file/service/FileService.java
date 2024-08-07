package S11P12A708.A708.domain.file.service;

import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.exception.CodeNotFoundException;
import S11P12A708.A708.domain.code.repository.CodeRepository;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.file.exception.*;
import S11P12A708.A708.domain.file.repository.FileRepository;
import S11P12A708.A708.domain.file.request.CodeFileUpdateRequest;
import S11P12A708.A708.domain.file.request.FileCreateRequest;
import S11P12A708.A708.domain.file.request.FileUpdateRequest;
import S11P12A708.A708.domain.file.response.FileInfoResponse;
import S11P12A708.A708.domain.file.response.FileProblemResponse;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNotBelongToTeamException;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.problem.repository.ProblemUserRepository;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.study.repository.StudyRepository;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final TeamRepository teamRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final StudyRepository studyRepository;
    private final CodeRepository codeRepository;
    private final TeamUserRepository teamUserRepository;
    private final ProblemUserRepository problemUserRepository;

    public FileInfoResponse createNormalFile(Long teamId, FileCreateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderRepository.findById(request.getFolderId()).orElseThrow(FolderNotFoundException::new);
        validateTeamFolder(folder, team);
        validateDuplicateFileName(folder, request.getFileName());

        final File newFile = File.createNormalFile(request.getFileName(), folder);
        fileRepository.save(newFile);

        return FileInfoResponse.fromFile(newFile);
    }

    public FileInfoResponse updateNormalFile(Long teamId, Long fileId, FileUpdateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);
        validateTeamFolder(file.getFolder(), team); // 해당 파일이 이 팀의 파일이 맞는 지 확인
        if (!file.getName().equals(request.getName())) validateDuplicateFileName(file.getFolder(), request.getName());

        final File updateFile = FileUpdateRequestToFile(request, file.getFolder());
        file.update(updateFile);

        return FileInfoResponse.fromFile(file);
    }

    public FileInfoResponse createCodeFile(Long teamId, AuthUserDto authUser, FileCreateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderRepository.findById(request.getFolderId()).orElseThrow(FolderNotFoundException::new);
        final User user = userRepository.findById(authUser.getId()).orElseThrow(UserNotFoundException::new);
        validateTeamFolder(folder, team);
        validateDuplicateFileName(folder, request.getFileName());
        validateProblemFolder(folder);

        final Code code = codeRepository.save(Code.createBasic());
        final File newFile = File.createCodeFile(request.getFileName(), user, folder, code);
        fileRepository.save(newFile);

        return FileInfoResponse.fromFile(newFile);
    }

    public FileInfoResponse updateCodeFile(Long teamId, Long fileId, CodeFileUpdateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);
        Code code = file.getCode();
        validateTeamFolder(file.getFolder(), team); // 해당 파일이 이 팀의 파일이 맞는 지 확인
        if (!file.getName().equals(request.getName())) validateDuplicateFileName(file.getFolder(), request.getName());

        code.update(new Code(request.getCode(), request.getLanguage()));
        file.update(request);

        return FileInfoResponse.fromFile(file);
    }

    public FileInfoResponse getFileInfo(Long teamId, AuthUserDto authUser, Long fileId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final User user = userRepository.findById(authUser.getId()).orElseThrow(UserNotFoundException::new);
        final File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);

        if(file.getType() == FileType.OVERVIEW) {
            final List<Study> studies = studyRepository.findByTeam(team);
            final List<FileProblemResponse> fileProblems = new ArrayList<>();
            for(Study study : studies) {
                for (Problem problem : problemRepository.findByStudy(study)) { // 팀에 소속된 전체 문제들
                    fileProblems.add(
                            FileProblemResponse.of(problem, teamQueryRepository.findSolveUsersByProblemId(problem.getId())));
                }
            }

            return FileInfoResponse.fromOverViewFile(file, fileProblems);
        }

        if(file.getType() == FileType.TIME_OVERVIEW) {
            final Folder folder = file.getFolder();
            final List<FileProblemResponse> fileProblems = new ArrayList<>();
            final List<Problem> problems = folder.getSubFolders().stream()
                    .map(Folder::getProblem)
                    .toList();
            for (Problem problem : problems) {
                fileProblems.add(
                        FileProblemResponse.of(problem, teamQueryRepository.findSolveUsersByProblemId(problem.getId())));
            }

            return FileInfoResponse.fromTimeOverViewFile(file, fileProblems, file.getStudy());
        }

        if(file.getType() == FileType.CODE) {
            return FileInfoResponse.fromCodeFile(file, file.getCode());
        }

        return FileInfoResponse.fromFile(file);
    }

    private File FileUpdateRequestToFile(FileUpdateRequest request, Folder folder) {
        return new File(
                request.getName(),
                request.getContent(),
                FileType.NORMAL,
                folder
        );
    }

    private static void validateTeamFolder(Folder folder, Team team) {
        if(!folder.getTeam().equals(team)) throw new FolderNotBelongToTeamException();
    }

    private void validateDuplicateFileName(Folder folder, String fileName) {
        final boolean isDuplicate = folder.getFiles().stream()
                .anyMatch(file -> file.getName().equals(fileName));
        if(isDuplicate) throw new FileNameDuplicateException();
    }

    private static void validateProblemFolder(Folder folder) {
        if(folder.getProblem().equals(null)) throw new FolderNotProblemInfoException();
    }

    public void deleteFile(Long teamId, Long fileId) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);

        if (file.getType() == FileType.NORMAL) {
            deleteNormalFile(fileId);
        } else if (file.getType() == FileType.CODE) {
            deleteCodeFile(file);
        } else throw new InvalidDeleteFileException();
    }

    private void deleteNormalFile(Long fileId) {
        fileRepository.deleteById(fileId);
    }

    private void deleteCodeFile(File file) {
        Optional<ProblemUser> problemUser = problemUserRepository.findProblemUserByFile(file);
        if (problemUser.isPresent()) throw new InvalidDeleteCodeFileException();

        codeRepository.delete(file.getCode());
        fileRepository.delete(file);
    }

}