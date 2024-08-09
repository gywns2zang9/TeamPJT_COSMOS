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
public class UserInfo {

    @NotBlank
    Long userId;

    @NotBlank
    String email;

    @NotBlank
    String nickName;

    @NotBlank
    Enum<UserType> type;

    String gitId;

    String repo;

    String branch;

    String description;

    public UserInfo(User user) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.nickName = user.getNickname();
        this.type = user.getType();
        this.gitId = user.getGitId();
        this.repo = user.getRepo();
        this.branch = user.getBranch();
        this.description = user.getDescription();
    }
}
