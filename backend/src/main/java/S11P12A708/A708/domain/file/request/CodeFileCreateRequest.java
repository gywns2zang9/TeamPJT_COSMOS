package S11P12A708.A708.domain.file.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CodeFileCreateRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long folderId;

    @NotBlank
    private String fileName;

}
