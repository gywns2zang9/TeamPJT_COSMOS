package S11P12A708.A708.domain.folder.response;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class FileResponse {

    private FileType type;

    private Long id;

    private String name;

    private Long parentId;

    private String content;

    public FileResponse(FileType type, Long id, String name, Long parentId, String content) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.content = content;
    }

    public static FileResponse of(Long folderId, File file) {
        return new FileResponse(
                file.getType(),
                file.getId(),
                file.getName(),
                folderId,
                file.getContent()
        );
    }
}