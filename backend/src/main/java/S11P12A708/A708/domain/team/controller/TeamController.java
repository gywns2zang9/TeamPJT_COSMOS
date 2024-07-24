package S11P12A708.A708.domain.team.controller;

import S11P12A708.A708.domain.team.request.TeamCreateRequest;
import S11P12A708.A708.domain.team.response.TeamResponse;
import S11P12A708.A708.domain.team.service.TeamService;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.entity.UserType;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final UserRepository userRepository;

    @GetMapping("/users/{userId}/groups")
    public ResponseEntity<List<TeamResponse>> teamList(
            // TODO: user token에서 유저 정보 받아오는 과정 필요
            @PathVariable Long userId) {

        final List<TeamResponse> teamResponses = teamService.getTeamsByUserId(userId);
        return new ResponseEntity<>(teamResponses, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/groups")
    public ResponseEntity<Void> teamList(
            // TODO: user token에서 유저 정보 받아오는 과정 필요
            @PathVariable Long userId,
            @Valid @RequestBody TeamCreateRequest request) {

        teamService.createTeam(userId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/teams/auth/{teamId}/teamCode")
    public ResponseEntity<TeamCodeResponse> getTeamCode(
            // TODO: user token에서 유저 정보 받아오는 과정 필요
            @PathVariable Long teamId) {

        final TeamCodeResponse response = teamService.getTeamCode(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
