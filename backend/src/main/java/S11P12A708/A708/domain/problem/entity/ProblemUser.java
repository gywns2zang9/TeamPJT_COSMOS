package S11P12A708.A708.domain.problem.entity;

import S11P12A708.A708.common.database.BaseEntity;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class ProblemUser extends BaseEntity {

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

    @Column(nullable = false)
    private boolean status;

    public ProblemUser(Problem problem, User user, File file) {
        this.problem = problem;
        this.user = user;
        this.file = file;
        this.status = false;
    }

    public void updateStatus() {
        this.status = true;
    }
}