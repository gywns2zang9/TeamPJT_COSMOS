package S11P12A708.A708.fixture;

import S11P12A708.A708.domain.team.entity.Team;
import lombok.Getter;
import org.springframework.test.util.ReflectionTestUtils;

@Getter
public enum TeamFixtures {

    TEAM1(0L, "team1", "team1_description"),
    TEAM2(1L, "team2", "team2_description"),
    TEAM3(2L, "team3", "team3_description");

    private final Long id;
    private final String groupName;
    private final String description;

    TeamFixtures(Long id, String groupName, String description) {
        this.id = id;
        this.groupName = groupName;
        this.description = description;
    }

    public Team 생성() {
        final Team team = new Team(
                this.groupName,
                this.description
        );
        ReflectionTestUtils.setField(team, "id", this.id);
        return team;
    }

}
