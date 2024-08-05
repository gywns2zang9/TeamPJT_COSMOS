package S11P12A708.A708.domain.folder.response;

import S11P12A708.A708.domain.folder.entity.Folder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class FolderInfoResponse {

    private Long folderId;
    private List<FolderResponse> folders;
    private List<FileResponse> files;

    public FolderInfoResponse(Long folderId, List<FolderResponse> folders, List<FileResponse> files) {
        this.folderId = folderId;
        this.folders = folders;
        this.files = files;
    }

    public static FolderInfoResponse of(Folder folder) {
        final Long folderId = folder.getId();
        return new FolderInfoResponse(
                folder.getId(),
                folder.getSubFolders().stream().
                        map(FolderResponse::fromFolder)
                        .toList(),
                folder.getFiles().stream()
                        .map(file -> FileResponse.of(folderId, file))
                        .toList()
        );
    }
}