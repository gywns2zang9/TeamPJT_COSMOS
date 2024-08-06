package S11P12A708.A708.domain.code.response;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.entity.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CodeResponse {

    @NotNull
    Long id;

    @NotBlank
    String content;

    @NotBlank
    Language language;

    public CodeResponse(Code code) {
        this.id = code.getId();
        this.content = code.getContent();
        this.language = code.getLanguage();
    }
}