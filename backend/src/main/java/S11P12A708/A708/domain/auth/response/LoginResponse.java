package S11P12A708.A708.domain.auth.response;

import S11P12A708.A708.domain.user.response.UserInfo;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    @NotBlank
    String accessToken;

    @NotBlank
    String refreshToken;

    @NotBlank
    UserInfo userInfo;
}
