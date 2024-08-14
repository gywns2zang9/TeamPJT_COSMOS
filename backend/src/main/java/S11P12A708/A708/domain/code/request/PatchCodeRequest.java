package S11P12A708.A708.domain.code.request;

import S11P12A708.A708.domain.code.entity.Language;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PatchCodeRequest {

    @NotNull
    String content;

    @NotNull
    Language language;

}