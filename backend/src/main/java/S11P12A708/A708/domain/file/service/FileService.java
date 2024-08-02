package S11P12A708.A708.domain.file.service;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.file.exception.FileNameDuplicateException;
import S11P12A708.A708.domain.file.exception.FileNotFoundException;
import S11P12A708.A708.domain.file.repository.FileRepository;
import S11P12A708.A708.domain.file.request.FileCreateRequest;
import S11P12A708.A708.domain.file.request.FileUpdateRequest;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNameDuplicateException;
import S11P12A708.A708.domain.folder.exception.FolderNotBelongToTeamException;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final TeamRepository teamRepository;

    public void createNormalFile(Long teamId, FileCreateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderRepository.findById(request.getFolderId()).orElseThrow(FolderNotFoundException::new);
        validateTeamFolder(folder, team);
        validateDuplicateFileName(folder, request.getFileName());

        final File newFile = File.createNormalFile(request.getFileName(), folder);
        fileRepository.save(newFile);
    }

    public void updateNormalFile(Long teamId, Long fileId, FileUpdateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final File file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);
        validateTeamFolder(file.getFolder(), team); // 해당 파일이 이 팀의 파일이 맞는 지 확인
        validateDuplicateFileName(file.getFolder(), request.getName());

        final File updateFile = FileUpdateRequestToFile(request, file.getFolder());
        file.update(updateFile);
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

}