package S11P12A708.A708.domain.folder.response;

import S11P12A708.A708.domain.file.response.FileInfoResponse;
import S11P12A708.A708.domain.folder.entity.Folder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class AllFolderInfoResponse {

    private Long folderId;
    private String name;
    private List<AllFolderInfoResponse> folders;
    private List<FileResponse> files;

    public AllFolderInfoResponse(Long folderId, String name, List<AllFolderInfoResponse> folders, List<FileResponse> files) {
        this.folderId = folderId;
        this.name = name;
        this.folders = folders;
        this.files = files;
    }

    public static AllFolderInfoResponse fromFolder(Folder folder) {
        return new AllFolderInfoResponse(
                folder.getId(),
                folder.getName(),
                folder.getSubFolders().stream()
                        .map(AllFolderInfoResponse::fromFolder)
                        .toList(),
                folder.getFiles().stream()
                        .map(file -> FileResponse.of(folder.getId(), file))
                        .toList()
        );
    }

}