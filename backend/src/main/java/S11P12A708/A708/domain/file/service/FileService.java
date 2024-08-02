package S11P12A708.A708.domain.file.service;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.file.repository.FileRepository;
import S11P12A708.A708.domain.file.request.FileCreateRequest;
import S11P12A708.A708.domain.folder.entity.Folder;
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
    private final UserRepository userRepository;

    public void createNormalFile(Long teamId, FileCreateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderRepository.findById(request.getFolderId()).orElseThrow(FolderNotFoundException::new);
        validateTeamFolder(folder, team);

        final File newFile = File.createNormalFile(request.getFileName(), folder);
        fileRepository.save(newFile);
    }


    private static void validateTeamFolder(Folder folder, Team team) {
        if(!folder.getTeam().equals(team)) throw new FolderNotBelongToTeamException();
    }

}