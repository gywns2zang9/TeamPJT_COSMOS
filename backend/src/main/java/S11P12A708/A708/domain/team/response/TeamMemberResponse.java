package S11P12A708.A708.domain.team.response;

import S11P12A708.A708.domain.user.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TeamMemberResponse {

    private final Long userId;
    private final String nickName;

    public static TeamMemberResponse of(final User user) {
        return new TeamMemberResponse(
                user.getId(),
                user.getNickname()
        );
    }

}
