package S11P12A708.A708.domain.code.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ExecuteCodeResponse {

    @NotBlank
    String[] results;
}