package S11P12A708.A708.fixture;

import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.entity.UserType;
import lombok.Getter;
import org.springframework.test.util.ReflectionTestUtils;

import static S11P12A708.A708.domain.user.entity.UserType.NORMAL;

@Getter
public enum UserFixtures {

    DODO(0L, "dodo@gmail.com", "1234", NORMAL, "dodo"),
    SKQHS(1L, "skqhs@gmail.com", "1234", NORMAL, "skqhs"),
    HYUKJI(2L, "hyukji@gmail.com", "1234", NORMAL, "hyukji");

    private final Long id;
    private final String email;
    private final String password;
    private final UserType type;
    private final String nickname;

    UserFixtures(Long id, String email, String password, UserType type, String nickname) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.type = type;
        this.nickname = nickname;
    }

    public User 생성() {
        final User user = new User(
                this.email,
                this.password,
                this.type,
                this.nickname
        );
        ReflectionTestUtils.setField(user, "id", this.id);
        return user;
    }

}
