package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.entity.TeamUserRole;
import S11P12A708.A708.domain.team.exception.LeaderLeaveException;
import S11P12A708.A708.domain.team.exception.LeaderNotException;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.request.TeamLeaderRequest;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static S11P12A708.A708.domain.team.entity.TeamUserRole.LEADER;
import static S11P12A708.A708.domain.team.entity.TeamUserRole.MEMBER;
import static S11P12A708.A708.fixture.TeamFixtures.TEAM1;
import static S11P12A708.A708.fixture.UserFixtures.DODO;
import static S11P12A708.A708.fixture.UserFixtures.SKQHS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class TeamMainServiceTest {

    private final TeamRepository teamRepository = BDDMockito.mock(TeamRepository.class);
    private final TeamUserRepository teamUserRepository  = BDDMockito.mock(TeamUserRepository.class);
    private final TeamQueryRepository teamQueryRepository = BDDMockito.mock(TeamQueryRepository.class);

    private final UserRepository userRepository = BDDMockito.mock(UserRepository.class);

    private final TeamMainService teamMainService = new TeamMainService(
            teamRepository,
            teamQueryRepository,
            teamUserRepository,
            userRepository);

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

    @Test
    @DisplayName("그룹 정보를 수정한다.")
    void editTeamInfo() {
        // given
        Team team = TEAM1.생성();
        User user = DODO.생성();
        TeamUser teamUser = new TeamUser(user, team, LEADER);
        TeamInfoRequest request = new TeamInfoRequest("New Team Name", "New Description");

        given(teamRepository.findById(TEAM1.getId())).willReturn(Optional.of(team));
        given(userRepository.findById(user.getId())).willReturn(Optional.of(user));
        given(teamUserRepository.findByTeamAndUser(team, user)).willReturn(teamUser);

        // when
        teamMainService.updateTeamDetail(DODO.getId(), TEAM1.getId(), request);

        // then
        assertThat(team.getId()).isEqualTo(TEAM1.getId());
        assertThat(team.getName()).isEqualTo(request.getTeamName());
        assertThat(team.getDescription()).isEqualTo(request.getDescription());
    }

    @Test
    @DisplayName("해당 팀이 존재하지 않는다면 예외를 던진다.")
    void isNotExistTeam() {
        // given
        Long teamId = TEAM1.getId();
        given(teamRepository.findById(teamId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(
                () -> teamMainService.updateTeamDetail(1L, teamId, new TeamInfoRequest("New Team Name", "New Description"))
        ).isInstanceOf(TeamNotFoundException.class);
    }

    @Test
    @DisplayName("로그인 유저가 리더가 아니라면 예외를 던진다.")
    void isNotLeader() {
        // given
        Long loginId = DODO.getId();
        Long teamId = TEAM1.getId();
        Team team = TEAM1.생성();
        User user = DODO.생성();
        TeamUser teamUser = new TeamUser(user, team, TeamUserRole.MEMBER); // 리더가 아닌 멤버로 설정
        TeamInfoRequest request = new TeamInfoRequest("New Team Name", "New Description");

        given(teamRepository.findById(teamId)).willReturn(Optional.of(team));
        given(userRepository.findById(loginId)).willReturn(Optional.of(user));
        given(teamUserRepository.findByTeamAndUser(team, user)).willReturn(teamUser);

        // when & then
        assertThatThrownBy(
                () -> teamMainService.updateTeamDetail(loginId, teamId, request)
        ).isInstanceOf(LeaderNotException.class); // 리더가 아닌 경우 예외를 던지도록 설정
    }

    @Nested
    @DisplayName("그룹장 여부 체크")
    class TeamLeaderCheck {

        @Test
        @DisplayName("로그인 유저가 그룹장인지 확인한다.")
        void checkLeader() {
            // given
            Team team = TEAM1.생성();
            User user = DODO.생성();
            TeamUser leader = new TeamUser(user, team, LEADER);

            given(teamRepository.findById(team.getId())).willReturn(Optional.of(team));
            given(teamQueryRepository.findLeaderUserByTeamId(team.getId())).willReturn(leader);

            // when
            Boolean result = teamMainService.checkTeamLeader(team.getId(), user.getId());

            // then
            assertThat(result).isTrue();
        }

    }


    @Nested
    @DisplayName("그룹장 임명")
    class TeamLeaderChange {

        @Test
        @DisplayName("로그인 유저는 리더에서 멤버로, 호출된 유저는 멤버에서 리더로 임명한다.")
        void changeTeamRole() {
            // given
            Long teamId = TEAM1.getId();
            Long loginId = DODO.getId(); // 로그인 사용자
            Long newLeaderId = SKQHS.getId(); // 새 리더로 임명할 사용자

            Team team = TEAM1.생성(); // 가상의 팀 객체 생성
            User loginUser = DODO.생성(); // 현재 리더
            User newLeaderUser = SKQHS.생성(); // 새 리더로 임명할 사용자
            TeamUser loginTeamUser = new TeamUser(loginUser, team, LEADER); // 현재 리더
            TeamUser newLeaderTeamUser = new TeamUser(newLeaderUser, team, MEMBER); // 새 리더로 임명할 사용자

            given(teamRepository.findById(teamId)).willReturn(Optional.of(team));
            given(userRepository.findById(loginId)).willReturn(Optional.of(loginUser));
            given(userRepository.findById(newLeaderId)).willReturn(Optional.of(newLeaderUser));
            given(teamUserRepository.findByTeamAndUser(team, loginUser)).willReturn(loginTeamUser);
            given(teamQueryRepository.findTeamUserByIds(team.getId(), newLeaderUser.getId())).willReturn(newLeaderTeamUser);

            // when
            teamMainService.updateTeamLeader(loginId, teamId, new TeamLeaderRequest(newLeaderId));

            // then
            assertThat(loginTeamUser.getRole()).isEqualTo(MEMBER);
            assertThat(newLeaderTeamUser.getRole()).isEqualTo(LEADER);
        }

        @Test
        @DisplayName("로그인 유저가 그룹장이 아니면 예외를 던진다.")
        void loginUserNotLeader() {
            // given
            Long teamId = TEAM1.getId();
            Long loginId = DODO.getId(); // 로그인 사용자
            Long newLeaderId = SKQHS.getId(); // 새 리더로 임명할 사용자

            Team team = TEAM1.생성(); // 가상의 팀 객체 생성
            User loginUser = DODO.생성(); // 현재 리더
            User newLeaderUser = SKQHS.생성(); // 새 리더로 임명할 사용자
            TeamUser loginTeamUser = new TeamUser(loginUser, team, MEMBER); // 현재 리더
            TeamUser newLeaderTeamUser = new TeamUser(newLeaderUser, team, MEMBER); // 새 리더로 임명할 사용자

            given(teamRepository.findById(teamId)).willReturn(Optional.of(team));
            given(userRepository.findById(loginId)).willReturn(Optional.of(loginUser));
            given(userRepository.findById(newLeaderId)).willReturn(Optional.of(newLeaderUser));
            given(teamUserRepository.findByTeamAndUser(team, loginUser)).willReturn(loginTeamUser);
            given(teamQueryRepository.findTeamUserByIds(team.getId(), newLeaderUser.getId())).willReturn(newLeaderTeamUser);

            // when & then
            assertThatThrownBy(() -> teamMainService.updateTeamLeader(loginId, teamId, new TeamLeaderRequest(newLeaderId)))
                    .isInstanceOf(LeaderNotException.class);
        }
    }


    @Nested
    @DisplayName("그룹 나가기")
    class TeamExit {

        @Test
        @DisplayName("멤버 유저는 그룹에서 나갈 수 있다.")
        void memberCanExit() {
            Long teamId = TEAM1.getId();
            Long loginId = DODO.getId(); // 로그인 사용자

            Team team = TEAM1.생성(); // 가상의 팀 객체 생성
            User loginUser = DODO.생성(); // 현재 리더
            User teamLeader = SKQHS.생성(); // 현재 리더
            List<User> members = List.of(loginUser, teamLeader);

            TeamUser MemberTeamUser = new TeamUser(loginUser, team, MEMBER); // 현재 리더
            given(teamQueryRepository.findTeamUserByIds(teamId, loginId)).willReturn(MemberTeamUser);
            given(teamQueryRepository.findUsersByTeamId(teamId)).willReturn(members);

            teamMainService.exitTeam(teamId, loginId);

            Mockito.verify(teamUserRepository).deleteById(any());
        }

        @Test
        @DisplayName("리더는 팀에 혼자 남았다면 나갈 수 있다.")
        void leaderCanExit() {
            Long teamId = TEAM1.getId();
            Long loginId = DODO.getId(); // 로그인 사용자

            Team team = TEAM1.생성(); // 가상의 팀 객체 생성
            User loginUser = DODO.생성(); // 현재 리더
            List<User> members = List.of(loginUser);

            TeamUser MemberTeamUser = new TeamUser(loginUser, team, LEADER); // 현재 리더
            given(teamQueryRepository.findTeamUserByIds(teamId, loginId)).willReturn(MemberTeamUser);
            given(teamQueryRepository.findUsersByTeamId(teamId)).willReturn(members);

            teamMainService.exitTeam(teamId, loginId);

            Mockito.verify(teamRepository).deleteById(any());
            Mockito.verify(teamUserRepository).deleteById(any());
        }

        @Test
        @DisplayName("리더는 팀에 다른 팀원이 존재하면 예외를 던진다.")
        void leaderCannotExit() {
            Long teamId = TEAM1.getId();
            Long loginId = DODO.getId(); // 로그인 사용자

            Team team = TEAM1.생성(); // 가상의 팀 객체 생성
            User loginUser = DODO.생성(); // 현재 리더
            User teamLeader = SKQHS.생성(); // 현재 리더
            List<User> members = List.of(loginUser, teamLeader);

            TeamUser MemberTeamUser = new TeamUser(loginUser, team, LEADER); // 현재 리더
            given(teamQueryRepository.findTeamUserByIds(teamId, loginId)).willReturn(MemberTeamUser);
            given(teamQueryRepository.findUsersByTeamId(teamId)).willReturn(members);

            assertThatThrownBy(() -> teamMainService.exitTeam(teamId, loginId))
                    .isInstanceOf(LeaderLeaveException.class);

        }

    }

}