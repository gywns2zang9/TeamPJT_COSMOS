package S11P12A708.A708.domain.user.entity;

//import S11P12A708.A708.domain.group.entity.GroupUser;
import S11P12A708.A708.domain.team.entity.TeamUser;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    // Converter를 이용해도 된다고 하던데 맘대루! https://medium.com/frientrip/spring-jpa%EC%9D%98-enum-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EC%93%B0%EC%9E%90-f60525a882b0
    private UserType type;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String gitId;

    private String repo;

    private String description;

    @Column(nullable = false)
    private String img;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;

    @OneToMany(mappedBy = "user")
    private List<TeamUser> teamUsers = new ArrayList<>();

    public User(String email, String password, UserType type, String nickname) {
        this.email = email;
        this.password = password;
        this.type = type;
        this.nickname = nickname;
        this.img = "s3 주소";
    }

}
