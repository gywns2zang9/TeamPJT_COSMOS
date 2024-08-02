package S11P12A708.A708.domain.folder.response;

import S11P12A708.A708.domain.folder.entity.Folder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class FolderResponse {

    private final String type = "FOLDER";

    private Long id;

    private String name;

    private Long parentId;

    public FolderResponse(Long id, String name, Long parentId) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
    }

    public static FolderResponse fromFolder(final Folder folder) {
        return new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getParentFolder().getId()
        );
    }

}