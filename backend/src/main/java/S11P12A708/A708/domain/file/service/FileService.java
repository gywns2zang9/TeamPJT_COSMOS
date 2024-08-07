package S11P12A708.A708.domain.file.service;

import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.file.exception.FileNameDuplicateException;
import S11P12A708.A708.domain.file.exception.FileNotFoundException;
import S11P12A708.A708.domain.file.exception.FolderNotProblemInfoException;
import S11P12A708.A708.domain.file.repository.FileRepository;
import S11P12A708.A708.domain.file.request.FileCreateRequest;
import S11P12A708.A708.domain.file.request.FileUpdateRequest;
import S11P12A708.A708.domain.file.response.FileResponse;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNotBelongToTeamException;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.study.repository.StudyRepository;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final StudyRepository studyRepository;

    public FileResponse createNormalFile(Long teamId, FileCreateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderRepository.findById(request.getFolderId()).orElseThrow(FolderNotFoundException::new);
        validateTeamFolder(folder, team);
        validateDuplicateFileName(folder, request.getFileName());

        final File newFile = File.createNormalFile(request.getFileName(), folder);
        fileRepository.save(newFile);

        return FileResponse.fromFile(newFile);
    }

    public void updateNormalFile(Long teamId, Long fileId, FileUpdateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);
        validateTeamFolder(file.getFolder(), team); // 해당 파일이 이 팀의 파일이 맞는 지 확인
        validateDuplicateFileName(file.getFolder(), request.getName());

        final File updateFile = FileUpdateRequestToFile(request, file.getFolder());
        file.update(updateFile);
    }

    public void createCodeFile(Long teamId, AuthUserDto authUser, FileCreateRequest request) {
        // TODO : 현재 문제를 담는 폴더가 만들어 지지 않아 테스트가 불가함. 추후에 테스트까지 진행할 예정
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderRepository.findById(request.getFolderId()).orElseThrow(FolderNotFoundException::new);
        final User user = userRepository.findById(authUser.getId()).orElseThrow(UserNotFoundException::new);
        validateTeamFolder(folder, team);
        validateDuplicateFileName(folder, request.getFileName());
        validateProblemFolder(folder);

        final Code code = Code.createBasic();
        final File newFile = File.createCodeFile(request.getFileName(), user, folder, code);
        fileRepository.save(newFile);
    }

    public FileResponse getFileInfo(Long teamId, AuthUserDto authUser, Long fileId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final User user = userRepository.findById(authUser.getId()).orElseThrow(UserNotFoundException::new);
        final File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);

        if(file.getType() == FileType.OVERVIEW) {
            final List<Study> studies = studyRepository.findByTeam(team);
            final List<Problem> problems = new java.util.ArrayList<>();
            for(Study study : studies) {
                problems.addAll(problemRepository.findByStudy(study)); // 팀에 소속된 전체 문제들
            }

            return FileResponse.fromOverViewFile(file, problems);
        }

        if(file.getType() == FileType.TIME_OVERVIEW) {
            final Folder folder = file.getFolder();
            final List<Problem> problems = folder.getSubFolders().stream()
                    .map(Folder::getProblem)
                    .toList();

            return FileResponse.fromOverViewFile(file, problems);
        }

        if(file.getType() == FileType.CODE) {
            return FileResponse.fromCodeFile(file, file.getCode());
        }

        return FileResponse.fromFile(file);
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

}