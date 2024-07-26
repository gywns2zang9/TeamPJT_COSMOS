package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.common.error.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.fixture.TeamFixtures;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static S11P12A708.A708.fixture.TeamFixtures.TEAM1;
import static S11P12A708.A708.fixture.UserFixtures.DODO;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class TeamMainServiceTest {

    private final TeamRepository teamRepository = BDDMockito.mock(TeamRepository.class);
    private final TeamUserRepository teamUserRepository  = BDDMockito.mock(TeamUserRepository.class);
    private final TeamQueryRepository teamQueryRepository = BDDMockito.mock(TeamQueryRepository.class);

    private final TeamMainService teamMainService = new TeamMainService(
            teamRepository,
            teamQueryRepository,
            teamUserRepository);

    @Nested
    @DisplayName("그룹 상세")
    class TeamDetail {

        @Test
        @DisplayName("그룹 상세 내용을 보여준다")
        void getTeamDetail() {
            // given
            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.of(TEAM1.생성()));
            given(teamQueryRepository.findUsersByTeamId(TEAM1.getId()))
                    .willReturn(List.of(DODO.생성()));

            // when
            final TeamDetailResponse result = teamMainService.getTeamDetail(TEAM1.getId());

            // then
            assertThat(result.getId()).isEqualTo(TEAM1.getId());
            assertThat(result.getName()).isEqualTo(TEAM1.getGroupName());
            assertThat(result.getDescription()).isEqualTo(TEAM1.getDescription());
            assertThat(result.getMembers().get(0).getUserId()).isEqualTo(DODO.getId());
            assertThat(result.getMembers().get(0).getNickName()).isEqualTo(DODO.getNickname());
        }

        @Test
        @DisplayName("해당 팀이 존재하지 않는다면 예외를 던진다.")
        void teamIsNotExist() {
            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(
                    () -> teamMainService.getTeamDetail(TEAM1.getId())
            ).isInstanceOf(TeamNotFoundException.class);
        }

    }

    @Nested
    @DisplayName("그룹 멤버")
    class TeamMembers {

        @Test
        @DisplayName("그룹 멤버 목록을 보여준다")
        void getTeamMembers() {
            given(teamRepository.existsById(TEAM1.getId())).willReturn(true);
            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.of(TEAM1.생성()));
            given(teamQueryRepository.findUsersByTeamId(TEAM1.getId()))
                    .willReturn(List.of(DODO.생성()));

            // when
            final List<TeamMemberResponse> results = teamMainService.getTeamMembers(TEAM1.getId());

            // then
            assertThat(results.get(0).getUserId()).isEqualTo(DODO.getId());
            assertThat(results.get(0).getNickName()).isEqualTo(DODO.getNickname());
        }

        @Test
        @DisplayName("해당 팀이 존재하지 않는다면 예외를 던진다.")
        void isNotExistTeam() {
            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(
                    () -> teamMainService.getTeamMembers(TEAM1.getId())
            ).isInstanceOf(TeamNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("그룹 정보 수정")
    class TeamInfoUpdate {

        @Test
        @DisplayName("그룹 정보를 수정한다.")
        void editTeamInfo() {
//            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.of(TEAM1.생성()));

            // when
//            teamMainService.updateTeamDetail(TEAM1.getId(), createTeamInfoRequest(TEAM1));

            // then
//            verify(teamRepository).save(any(Team.class));
        }

        @Test
        @DisplayName("해당 팀이 존재하지 않는다면 예외를 던진다.")
        void isNotExistTeam() {
            given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(
                    () -> teamMainService.updateTeamDetail(TEAM1.getId(), createTeamInfoRequest(TEAM1))
            ).isInstanceOf(TeamNotFoundException.class);
        }


        @Test
        @DisplayName("로그인 유저가 리더가 아니라면 예외를 던진다.")
        void isNotLeader() {
            // TODO
        }

    }

    private TeamInfoRequest createTeamInfoRequest(TeamFixtures team) {
        return new TeamInfoRequest(team.getGroupName(), team.getDescription());
    }

    @Nested
    @DisplayName("그룹장 여부 체크")
    class TeamLeaderCheck {

        @Test
        @DisplayName("로그인 유저가 그룹장인지 확인한다.")
        void checkLeader() {

        }

        @Test
        @DisplayName("해당 팀이 존재하지 않는다면 예외를 던진다.")
        void isNotExistTeam() {

        }

        @Test
        @DisplayName("로그인 유저가 그룹에 속하지 않으면 예외를 던진다.")
        void notJoined() {}
    }

    @Nested
    @DisplayName("그룹장 임명")
    class TeamLeaderChange {

        @Test
        @DisplayName("로그인 유저는 리더에서 멤버로, 호출된 유저는 멤버에서 유저로 임명한다.")
        void changeTeamRole() {

        }

        @Test
        @DisplayName("로그인 유저가 그룹에 속하지 않으면 예외를 던진다.")
        void loginUserNotJoined() {

        }

        @Test
        @DisplayName("로그인 유저가 그룹장이 아니면 예외를 던진다.")
        void loginUserNotLeader() {

        }

        @Test
        @DisplayName("호출된 유저가 그룹에 속하지 않으면 예외를 던진다.")
        void newLeaderNotJoined() {

        }

        @Test
        @DisplayName("호출 유저가 일반 멤버인지 확인한다.")
        void newLeaderNotNormal() {

        }

    }

    @Nested
    @DisplayName("그룹 나가기")
    class TeamExit {

        @Test
        @DisplayName("멤버 유저는 그룹에서 나갈 수 있다.")
        void memberCanExit() {

        }

        @Test
        @DisplayName("리더는 팀에 혼자 남았다면 나갈 수 있다.")
        void leaderCanExit() {

        }

        @Test
        @DisplayName("리더는 팀에 다른 팀원이 존재하면 예외를 던진다.")
        void leaderCannotExit() {

        }

    }

}