package S11P12A708.A708.domain.team.entity;


import S11P12A708.A708.domain.team.service.TeamCodeGenerator.TeamCodeGenerator;
import S11P12A708.A708.util.TeamCodeFixedGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static S11P12A708.A708.fixture.TeamFixtures.TEAM1;
import static S11P12A708.A708.fixture.TeamFixtures.TEAM2;
import static org.assertj.core.api.Assertions.assertThat;

public class TeamTest {

    @Test
    @DisplayName("팀_참여코드는_UUID가_중복되어도_다른_팀코드를_가진다")
    void duplicateTeamCode() {
        // given
        Team team1 = TEAM1.생성();
        Team team2 = TEAM2.생성();
        TeamCodeGenerator generator = new TeamCodeFixedGenerator();

        // when
        team1.setTeamCode(generator);
        team2.setTeamCode(generator);

        // then
        final String team1Code = team1.getTeamCode();
        final String team2Code = team2.getTeamCode();
        assertThat(team1Code.equals(team2Code)).isFalse();
    }

}
