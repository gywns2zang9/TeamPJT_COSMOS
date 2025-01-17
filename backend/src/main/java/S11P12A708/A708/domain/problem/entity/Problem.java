package S11P12A708.A708.domain.problem.entity;

import S11P12A708.A708.common.util.BojProblem;
import S11P12A708.A708.common.database.BaseEntity;
import S11P12A708.A708.domain.study.entity.Study;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Problem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SiteInfoType site;

    private Integer number;

    @Column(nullable = false)
    private String name;

    private String level;

    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id")
    private Study study;

    public static Problem of(BojProblem problem, Study study) {
        return new Problem(
            problem.getSiteInfo(),
            problem.getNumber(),
            problem.getName(),
            problem.getLevel(),
            problem.getSiteUrl(),
            study
        );
    }

    public Problem(SiteInfoType site, Integer number, String name, String level, String url, Study study) {
        this.site = site;
        this.number = number;
        this.name = name;
        this.level = level;
        this.url = url;
        this.study = study;
    }
}
