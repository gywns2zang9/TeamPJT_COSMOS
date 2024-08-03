package S11P12A708.A708.domain.study.entity;


import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.team.entity.Team;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Study {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer times;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "study")
    private List<Problem> problems = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;


    public Study(Integer year, Integer month, Integer times, ArrayList<Problem> problems, Team team) {
        this.year = year;
        this.month = month;
        this.times = times;
        this.createdAt = LocalDateTime.now();
        this.problems = problems;
        this.team = team;
    }

    public static Study createStudy(Integer year, Integer month, Integer times, Team team) {
        return new Study( year, month, times, null, team);
    }

}
