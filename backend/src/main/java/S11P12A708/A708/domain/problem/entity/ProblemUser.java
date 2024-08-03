package S11P12A708.A708.domain.problem.entity;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class ProblemUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private File file;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public ProblemUser(Problem problem, User user, File file) {
        this.problem = problem;
        this.user = user;
        this.file = file;
        this.createdAt = LocalDateTime.now();
    }
}