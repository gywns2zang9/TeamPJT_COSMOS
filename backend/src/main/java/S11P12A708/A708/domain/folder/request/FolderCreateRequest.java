package S11P12A708.A708.domain.folder.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FolderCreateRequest {

    @NotNull
    private Long parentId;

    @NotBlank
    private String folderName;

}