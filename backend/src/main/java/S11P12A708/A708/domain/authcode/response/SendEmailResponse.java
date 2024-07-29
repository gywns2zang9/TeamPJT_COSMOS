package S11P12A708.A708.domain.authcode.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SendEmailResponse {

    @NotBlank
    int expiredTime;
}
