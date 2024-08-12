package S11P12A708.A708.domain.user.entity;

import S11P12A708.A708.common.database.BaseEntity;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.user.request.ChangeUserRequest;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserType type;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String gitId;

    private String repo;

    @ColumnDefault("'main'")
    private String branch;

    private String description;

    @OneToMany(mappedBy = "user")
    private List<TeamUser> teamUsers = new ArrayList<>();

    public User(String email, String password, UserType type, String nickname, String gitId, String repo, String branch) {
        this.email = email;
        this.password = password;
        this.type = type;
        this.nickname = nickname;
        this.gitId = gitId;
        this.repo = repo;
        this.branch = branch;
    }

    public User(String email, String password, UserType type, String nickname) {
        this.email = email;
        this.password = password;
        this.type = type;
        this.nickname = nickname;
    }

    public User(String email, UserType type, String nickname) {
        this.email = email;
        this.type = type;
        this.nickname = nickname;
    }

    public void update(ChangeUserRequest req) {
        this.gitId = req.getGitId();
        this.repo = req.getRepo();
        this.branch = req.getBranch();
        this.description = req.getDescription();
    }

    public void hashPassword(PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(this.password);
    }

    public boolean checkPassword(String plainPassword, PasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(plainPassword, this.password);
    }
}
