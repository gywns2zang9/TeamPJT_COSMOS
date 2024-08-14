package S11P12A708.A708.domain.study.entity;


import S11P12A708.A708.common.database.BaseEntity;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.team.entity.Team;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Study extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer times;

    @OneToMany(mappedBy = "study")
    private List<Problem> problems = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;


    public Study(Integer year, Integer month, Integer times, ArrayList<Problem> problems, Team team) {
        this.year = year;
        this.month = month;
        this.times = times;
        this.problems = problems;
        this.team = team;
    }

    public static Study createStudy(Integer year, Integer month, Integer times, Team team) {
        return new Study( year, month, times, null, team);
    }

    public String getStudyDateInfo() {
        String shortYear = String.format("%02d", year % 100);
        String formattedMonth = String.format("%d", month);
        return shortYear + "년 " + formattedMonth + "월 " + times + "회차";
    }

}
