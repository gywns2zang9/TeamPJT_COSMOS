package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.common.error.exception.TeamNotFoundException;
import S11P12A708.A708.common.error.exception.UserNotFoundException;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.TeamCreateRequest;
import S11P12A708.A708.domain.team.response.TeamResponse;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;
    private final UserRepository userRepository;
    private final TeamQueryRepository teamQueryRepository;

    public List<TeamResponse> getTeamsByUserId(Long userId) throws RuntimeException {
        final List<Team> teams = teamQueryRepository.findAllByUserId(userId)
                .orElseThrow(TeamNotFoundException::new);
        return teams.stream().map(TeamResponse::of).toList();
     }

    public void createTeam(Long userId, TeamCreateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.save(requestToEntity(request));
        teamUserRepository.save(TeamUser.create(user, team));
    }

    // TODO : 로그인한 유저와 요청한 유저가 같은지
    private boolean verityUserId(Long userId, Long AuthId) {
        return userId.equals(AuthId);
    }

    private Team requestToEntity(TeamCreateRequest request) {
        return new Team(
                request.getGroupName(),
                request.getDescription()
        );
    }


}
