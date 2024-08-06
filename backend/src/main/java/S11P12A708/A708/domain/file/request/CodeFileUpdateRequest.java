package S11P12A708.A708.domain.file.request;

import S11P12A708.A708.domain.code.entity.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CodeFileUpdateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String code;

    @NotBlank
    private String content;

    @NotNull
    private Language language;
}
