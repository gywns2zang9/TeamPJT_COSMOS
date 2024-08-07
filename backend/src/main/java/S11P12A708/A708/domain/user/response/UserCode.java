package S11P12A708.A708.domain.user.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCode {

    @NotBlank
    Long fileId;

    @NotBlank
    Long teamId;

    @NotBlank
    String problem;

}
