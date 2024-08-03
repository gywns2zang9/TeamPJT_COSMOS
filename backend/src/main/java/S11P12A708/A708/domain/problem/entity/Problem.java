package S11P12A708.A708.domain.problem.entity;


import S11P12A708.A708.common.util.BojProblem;
import S11P12A708.A708.domain.study.entity.Study;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SiteInfoType site;

    private String number;

    @Column(nullable = false)
    private String name;

    private String level;

    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id")
    private Study study;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // TODO: study가 현재 미구현 상태. 추후 생성자 주입 필요
    public static Problem of(BojProblem problem) {
        return new Problem(
                problem.getSiteInfo(),
                String.valueOf(problem.getNumber()),
                problem.getName(),
                problem.getLevel(),
                problem.getSiteUrl(),
//                study
                LocalDateTime.now()
        );
    }

    public Problem(SiteInfoType site, String number, String name, String level, String url, LocalDateTime createdAt) {
        this.site = site;
        this.number = number;
        this.name = name;
        this.level = level;
        this.url = url;
        this.createdAt = createdAt;
    }
}
