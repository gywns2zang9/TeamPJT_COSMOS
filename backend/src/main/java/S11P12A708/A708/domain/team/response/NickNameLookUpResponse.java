package S11P12A708.A708.domain.team.response;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NickNameLookUpResponse {

    @NotBlank
    private Long userId;

    @NotBlank
    private String nickName;

    @NotBlank
    private String email;

    static public NickNameLookUpResponse of(User user) {
        return new NickNameLookUpResponse(
                user.getId(),
                user.getNickname(),
                user.getEmail());
    }

}