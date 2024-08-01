package S11P12A708.A708.domain.authcode.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FindPwRequest {

    @NotBlank
    String email;

    @NotBlank
    String newPassword;
}