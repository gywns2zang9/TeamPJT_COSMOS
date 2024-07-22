package S11P12A708.A708.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
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
    // Converter를 이용해도 된다고 하던데 맘대루! https://medium.com/frientrip/spring-jpa%EC%9D%98-enum-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EC%93%B0%EC%9E%90-f60525a882b0
    private AuthType type;

    @Column(nullable = false)
    private String authToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

}
