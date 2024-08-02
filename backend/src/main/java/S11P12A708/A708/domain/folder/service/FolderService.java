package S11P12A708.A708.domain.folder.service;

import S11P12A708.A708.domain.file.repository.FileRepository;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNameDuplicateException;
import S11P12A708.A708.domain.folder.exception.FolderNotBelongToTeamException;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.folder.request.FolderCreateRequest;
import S11P12A708.A708.domain.folder.response.FolderInfoResponse;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class FolderService {

    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final TeamRepository teamRepository;

    public FolderInfoResponse getFolderInfo(Long teamId, Long folderId) {
        final Folder folder = folderRepository.findById(folderId).orElseThrow(FolderNotFoundException::new);
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        validateTeamFolder(folder, team);

        return FolderInfoResponse.of(folder);
    }

    public void createFolder(Long teamId, FolderCreateRequest request) {
        final Folder parentFolder = folderRepository.findById(request.getParentId()).orElseThrow(FolderNotFoundException::new);
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        validateTeamFolder(parentFolder, team);
        validateDuplicate(parentFolder, request.getFolderName());

        final Folder newFolder = requestToFolder(request, team, parentFolder);

        folderRepository.save(newFolder);
    }

    public void deleteFolder(Long teamId, Long folderId) {
        final Folder folder = folderRepository.findById(folderId).orElseThrow(FolderNotFoundException::new);
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        validateTeamFolder(folder, team);

        deleteSubFoldersAndFiles(folder);
    }

    private void deleteSubFoldersAndFiles(Folder folder) {
        for (Folder subFolder : folder.getSubFolders()) {
            deleteSubFoldersAndFiles(subFolder);
        }

        fileRepository.deleteAll(folder.getFiles());
        folderRepository.delete(folder);
    }

    private Folder requestToFolder(FolderCreateRequest request, Team team, Folder parentFolder) {
        return new Folder(request.getFolderName(), team, parentFolder);
    }

    private void validateDuplicate(Folder parentFolder, String folderName) {
        final boolean isDuplicate = parentFolder.getSubFolders().stream()
                .anyMatch(subFolder -> subFolder.getName().equals(folderName));
        if(isDuplicate) throw new FolderNameDuplicateException();
    }

    private static void validateTeamFolder(Folder folder, Team team) {
        if(!folder.getTeam().equals(team)) throw new FolderNotBelongToTeamException();
    }


}