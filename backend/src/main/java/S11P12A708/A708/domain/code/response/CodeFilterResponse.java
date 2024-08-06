package S11P12A708.A708.domain.code.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CodeFilterResponse {

    @NotNull
    Integer depth;

    @NotNull
    Long codeId;

    @NotBlank
    String problemName;

    @NotBlank
    String fileName;

}