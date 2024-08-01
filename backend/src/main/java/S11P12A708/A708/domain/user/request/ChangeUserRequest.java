package S11P12A708.A708.domain.user.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangeUserRequest {

    @NotBlank
    String nickName;

    @NotBlank
    String gitId;

    @NotBlank
    String repo;

    @NotBlank
    String description;
}