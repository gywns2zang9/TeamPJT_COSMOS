package S11P12A708.A708.domain.file.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SolveStatusResponse {

    @NotNull
    private Long userId;

    @NotBlank
    private String userName;

    @NotNull
    private boolean status;

    @NotNull
    private Long fileId;

}
