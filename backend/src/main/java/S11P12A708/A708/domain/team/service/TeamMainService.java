package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.common.error.exception.TeamNotFoundException;
import S11P12A708.A708.common.error.exception.LeaderLeaveException;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.request.TeamLeaderRequest;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static S11P12A708.A708.domain.team.entity.TeamUserRole.LEADER;
import static S11P12A708.A708.domain.team.entity.TeamUserRole.MEMBER;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamMainService {

    private final TeamRepository teamRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final TeamUserRepository teamUserRepository;

    // TODO : 로그인한 유저가 team의 멤버인지(권한 문제)

    public TeamDetailResponse getTeamDetail(final Long teamId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final List<User> users = teamQueryRepository.findUsersByTeamId(teamId);

        return TeamDetailResponse.of(
                team,
                convertUsersToTeamMemberResponse(users));
    }

    public List<TeamMemberResponse> getTeamMembers(final Long teamId) {
        validateTeamId(teamId);

        final List<User> users = teamQueryRepository.findUsersByTeamId(teamId);

        return convertUsersToTeamMemberResponse(users);
    }

    public void updateTeamDetail(final Long teamId, TeamInfoRequest request) {
        validateTeamId(teamId);
        // TODO : 로그인한 유저가 리더인지 확인

        final Team updateTeam = Team.of(teamId, request);
        teamRepository.save(updateTeam);
    }

    public void updateTeamLeader(final Long teamId, final TeamLeaderRequest request) {
        validateTeamId(teamId);

        // TODO : 로그인한 유저가 리더인지 확인
        final TeamUser leaderTeamUser = teamQueryRepository.findLeaderUserByTeamId(teamId);
        final TeamUser updateTeamUser = teamQueryRepository.findTeamUserByIds(teamId, request.getUserId());

        leaderTeamUser.changeRole(MEMBER);
        updateTeamUser.changeRole(LEADER);
    }

    public Boolean checkTeamLeader(final Long teamId, final Long loginId) {
        final TeamUser teamUser = teamQueryRepository.findLeaderUserByTeamId(teamId);

        return teamUser.sameUser(loginId);
    }

    public void exitTeam(final Long teamId, final Long loginId) {
        final TeamUser teamUser = teamQueryRepository.findTeamUserByIds(teamId, loginId);

        if(teamUser.isLeader()) { // 팀 리더라면 비어있을 때에만 나갈 수 있음
            final boolean isNotEmpty = teamQueryRepository.findUsersByTeamId(teamId).size() > 1;
            if(isNotEmpty) throw new LeaderLeaveException();

            teamRepository.deleteById(teamId); // 비어 있으므로 팀 제거
        }

        teamUserRepository.deleteById(teamUser.getId());
    }

    private List<TeamMemberResponse> convertUsersToTeamMemberResponse(final List<User> users) {
        return users.stream().map(TeamMemberResponse::of).toList();
    }

    private void validateTeamId(Long teamId) {
        if(!teamRepository.existsById(teamId)) throw new TeamNotFoundException();
    }

}