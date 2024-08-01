package S11P12A708.A708.domain.authcode.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Authcode {

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

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Authcode(String email, AuthType type, String authToken, LocalDateTime updatedAt) {
        this.email = email;
        this.type = type;
        this.authToken = authToken;
        this.updatedAt = updatedAt;
    }
}
