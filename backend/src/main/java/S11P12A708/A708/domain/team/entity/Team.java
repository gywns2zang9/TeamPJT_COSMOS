package S11P12A708.A708.domain.team.entity;

import S11P12A708.A708.domain.calendar.entity.Calendar;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.team.service.TeamCodeGenerator.TeamCodeGenerator;
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
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;

    private String description;

    @Column(unique = true)
    private String teamCode;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;

    @OneToMany(mappedBy = "team")
    private List<TeamUser> TeamUsers = new ArrayList<>();

    @OneToMany(mappedBy = "team")
    private List<Calendar> calendars = new ArrayList<>();

    @OneToMany(mappedBy = "team")
    private List<Study> studies = new ArrayList<>();

    public Team(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String setTeamCode(TeamCodeGenerator generator) {
        return this.teamCode = generator.generate(this.id);
    }

}
