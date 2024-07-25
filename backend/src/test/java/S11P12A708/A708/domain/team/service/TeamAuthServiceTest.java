package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamCreateRequest;
import S11P12A708.A708.domain.team.response.TeamCodeResponse;
import S11P12A708.A708.domain.team.response.TeamResponse;
import S11P12A708.A708.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static S11P12A708.A708.fixture.TeamFixtures.TEAM1;
import static S11P12A708.A708.fixture.UserFixtures.DODO;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TeamAuthServiceTest {

    private final TeamRepository teamRepository = BDDMockito.mock(TeamRepository.class);
    private final TeamUserRepository teamUserRepository  = BDDMockito.mock(TeamUserRepository.class);
    private final UserRepository userRepository = BDDMockito.mock(UserRepository.class);
    private final TeamQueryRepository teamQueryRepository = BDDMockito.mock(TeamQueryRepository.class);

    TeamCodeGenerator generator = new TeamCodeUUIDGenerator();

    private final TeamAuthService teamAuthService = new TeamAuthService(
            teamRepository,
            teamUserRepository,
            userRepository,
            teamQueryRepository,
            generator);

    @Nested
    @DisplayName("그룹목록")
    class TeamList {

        @Test
        @DisplayName("그룹목록을_읽어온다")
        void readTeamList() {
            // given
            List<Team> teams = new ArrayList<>();
            teams.add(TEAM1.생성());

            given(teamQueryRepository.findAllByUserId(DODO.getId())).willReturn(Optional.of(teams));

            // when
            List<TeamResponse> results = teamAuthService.getTeamsByUserId(DODO.getId());

            // then
            assertThat(results.get(0).getId()).isEqualTo(TEAM1.getId());
            assertThat(results.get(0).getName()).isEqualTo(TEAM1.getGroupName());
            assertThat(results.get(0).getDescription()).isEqualTo(TEAM1.getDescription());
        }

        @Test
        @DisplayName("로그인된_유저와_요청한_유저정보가_다르면_예외를_던진다")
        void checkLoginUser() {
            // TODO : 로그인 완료된 후에
        }

    }

    @Nested
    @DisplayName("그룹생성")
    class TeamCreation {

        @Test
        @DisplayName("새로운_그룹을_생성한다")
        void createNewTeam() {
            // given
            given(userRepository.findById(DODO.getId())).willReturn(Optional.of(DODO.생성()));
            given(teamRepository.save(TEAM1.생성())).willReturn(TEAM1.생성());

            // when & then
            assertDoesNotThrow(() -> teamAuthService.createTeam(DODO.getId(),
                    new TeamCreateRequest(
                            TEAM1.getGroupName(),
                            TEAM1.getDescription())));
        }

        @Test
        @DisplayName("로그인된_유저와_요청한_유저정보가_다르면_예외를_던진다")
        void checkLoginUser(){
            // TODO : 로그인 완료된 후에
        }

    }

    @Nested
    @DisplayName("팀코드")
    class TeamCode {

        @Test
        @DisplayName("팀코드가_없다면_새로생성해서_저장후에_반환한다")
        void createTeamCode() {
            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.of(TEAM1.생성()));

            // when
            TeamCodeResponse response = teamAuthService.getTeamCode(TEAM1.getId());

            // then
            assertAll(() -> {
                verify(teamRepository).save(any());
                assertThat(response.getTeamCode()).isNotNull();
            });
        }

        @Test
        @DisplayName("팀코드가_존재하면_기존_코드를_반환한다")
        void getTeamCode() {
            Team team1 = TEAM1.생성();
            team1.setTeamCode(generator);

            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.of(team1));

            // when
            TeamCodeResponse response = teamAuthService.getTeamCode(TEAM1.getId());

            // then
            assertThat(response.getTeamCode()).isEqualTo(team1.getTeamCode());

        }

    }

}