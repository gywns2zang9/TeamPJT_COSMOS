package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.common.error.exception.TeamNotFoundException;
import S11P12A708.A708.common.error.exception.UserNotFoundException;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.response.TeamCodeResponse;
import S11P12A708.A708.domain.team.response.TeamResponse;
import S11P12A708.A708.domain.team.service.TeamCodeGenerator.TeamCodeGenerator;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import static S11P12A708.A708.domain.team.entity.TeamUserRole.LEADER;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamAuthService {

    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;
    private final UserRepository userRepository;
    private final TeamQueryRepository teamQueryRepository;

    private final TeamCodeGenerator generator;

    public List<TeamResponse> getTeamsByUserId(Long userId) throws RuntimeException {
        final List<Team> teams = teamQueryRepository.findTeamsByUserId(userId).orElse(List.of());
        return teams.stream().map(TeamResponse::of).toList();
     }

    public void createTeam(Long userId, TeamInfoRequest request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.save(requestToEntity(request));
        teamUserRepository.save(new TeamUser(user, team, LEADER));
    }

    public TeamCodeResponse getTeamCode(Long teamId) {
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        String teamCode = team.getTeamCode();
        if(teamCode == null) {
            teamCode = team.setTeamCode(generator);
            teamRepository.save(team);
        }

        return new TeamCodeResponse(teamCode);
    }

    // TODO : 로그인한 유저와 요청한 유저가 같은지
    private boolean verityUserId(Long userId, Long AuthId) {
        return userId.equals(AuthId);
    }

    private Team requestToEntity(TeamInfoRequest request) {
        return new Team(
                request.getGroupName(),
                request.getDescription()
        );
    }
}
