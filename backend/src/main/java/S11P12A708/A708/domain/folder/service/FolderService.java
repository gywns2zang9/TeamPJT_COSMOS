package S11P12A708.A708.domain.folder.service;

import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNameDuplicateException;
import S11P12A708.A708.domain.folder.exception.FolderNotBelongToTeamException;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.folder.repository.query.FolderQueryRepository;
import S11P12A708.A708.domain.folder.request.FolderCreateRequest;
import S11P12A708.A708.domain.folder.response.FolderInfoResponse;
import S11P12A708.A708.domain.folder.response.FolderResponse;
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
    private final FolderQueryRepository folderQueryRepository;
    private final TeamRepository teamRepository;

    public AllFolderInfoResponse getAllFolderInfo(Long teamId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderQueryRepository.findRootFolderByTeam(teamId).orElseThrow(FolderNotFoundException::new);
        validateTeamFolder(folder, team);

        return AllFolderInfoResponse.fromFolder(folder);
    }
    public FolderInfoResponse getFolderInfo(Long teamId, Long folderId) {
        if(folderId == 0) return getRootFolderInfo(teamId);
        else return getNormalFolderInfo(teamId, folderId);
    }

    public FolderInfoResponse getNormalFolderInfo(Long teamId, Long folderId) {
        final Folder folder = folderRepository.findById(folderId).orElseThrow(FolderNotFoundException::new);
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        validateTeamFolder(folder, team);

        return FolderInfoResponse.of(folder);
    }

    public FolderInfoResponse getRootFolderInfo(Long teamId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final Folder folder = folderQueryRepository.findRootFolderByTeam(teamId).orElseThrow(FolderNotFoundException::new);
        validateTeamFolder(folder, team);

        return FolderInfoResponse.of(folder);
    }

    public FolderResponse createFolder(Long teamId, FolderCreateRequest request) {
        final Folder parentFolder = folderRepository.findById(request.getParentId()).orElseThrow(FolderNotFoundException::new);
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        validateTeamFolder(parentFolder, team);
        validateDuplicate(parentFolder, request.getFolderName());

        final Folder newFolder = requestToFolder(request, team, parentFolder);

        folderRepository.save(newFolder);

        return FolderResponse.fromFolder(newFolder);
    }

    public void deleteFolder(Long teamId, Long folderId) {
        final Folder folder = folderRepository.findById(folderId).orElseThrow(FolderNotFoundException::new);
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        validateTeamFolder(folder, team);

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