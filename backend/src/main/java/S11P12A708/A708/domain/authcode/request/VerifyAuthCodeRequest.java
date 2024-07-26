package S11P12A708.A708.domain.auth.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VerifyAuthCodeRequest {
    @NotBlank
    String email;

    @NotBlank
    String authCode;
}
