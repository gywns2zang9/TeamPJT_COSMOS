package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.common.error.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamMainService {

    private final TeamRepository teamRepository;
    private final TeamQueryRepository teamQueryRepository;

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

    private List<TeamMemberResponse> convertUsersToTeamMemberResponse(final List<User> users) {
        return users.stream().map(TeamMemberResponse::of).toList();
    }

    private void validateTeamId(Long teamId) {
        if(!teamRepository.existsById(teamId)) throw new TeamNotFoundException();
    }

}