package S11P12A708.A708.domain.user.response;

import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.entity.UserType;
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

    public UserCode(String fileId, Long teamId, String problem) {
        this.fileId = Long.parseLong(fileId);
        this.teamId = teamId;
        this.problem = problem;
    }
}
