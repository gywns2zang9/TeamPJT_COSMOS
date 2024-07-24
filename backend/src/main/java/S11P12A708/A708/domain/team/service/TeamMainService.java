package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.common.error.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamMainService {

    private final TeamRepository teamRepository;
    private final TeamQueryRepository teamQueryRepository;

    public TeamDetailResponse getTeamDetail(final Long teamId) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        final List<User> users = teamQueryRepository.findUsersByTeamId(teamId);
        // TODO : 로그인한 유저가 team의 멤버인지(권한 문제)

        return TeamDetailResponse.of(
                team,
                convertUsersToTeamMemberResponse(users));
    }

    public List<TeamMemberResponse> getTeamMembers(final Long teamId) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new); // 존재하는 팀인지 확인
        // TODO : 로그인한 유저가 team의 멤버인지(권한 문제)
        final List<User> users = teamQueryRepository.findUsersByTeamId(teamId);

        return convertUsersToTeamMemberResponse(users);
    }

    public List<TeamMemberResponse> convertUsersToTeamMemberResponse(final List<User> users) {
        return users.stream().map(TeamMemberResponse::of).toList();
    }

}
