package S11P12A708.A708.domain.authcode.entity;

import S11P12A708.A708.common.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Authcode extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthType type;

    @Column()
    private String authToken;

    public Authcode(String email, AuthType type, String authToken, LocalDateTime updatedAt) {
        this.email = email;
        this.type = type;
        this.authToken = authToken;
    }
}
