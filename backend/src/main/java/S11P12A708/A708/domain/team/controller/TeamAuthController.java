package S11P12A708.A708.domain.team.controller;

import S11P12A708.A708.domain.team.request.InviteTeamRequest;
import S11P12A708.A708.domain.team.request.NickNameLookUpRequest;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.request.TeamJoinRequest;
import S11P12A708.A708.domain.team.response.NickNameLookUpResponse;
import S11P12A708.A708.domain.team.response.TeamCodeResponse;
import S11P12A708.A708.domain.team.response.TeamIdResponse;
import S11P12A708.A708.domain.team.response.TeamResponse;
import S11P12A708.A708.domain.team.service.TeamAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TeamAuthController {

    private final TeamAuthService teamAuthService;

    @GetMapping("/users/{userId}/teams")
    public ResponseEntity<List<TeamResponse>> getTeamList(
            @PathVariable Long userId) {

        final List<TeamResponse> teamResponses = teamAuthService.getTeamsByUserId(userId);
        return new ResponseEntity<>(teamResponses, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/team")
    public ResponseEntity<TeamIdResponse> createTeam(
            @PathVariable Long userId,
            @Valid @RequestBody TeamInfoRequest request) {

        final TeamIdResponse response = teamAuthService.createTeam(userId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PostMapping("/users/{userId}/teams/teamCode")
    public ResponseEntity<Void> joinTeam(
            @PathVariable Long userId,
            @Valid @RequestBody TeamJoinRequest request) {

        teamAuthService.joinTeam(userId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/teams/auth/{teamId}/members")
    public ResponseEntity<List<NickNameLookUpResponse>> getUserListOfNickName(
            @PathVariable Long teamId,
            @RequestBody NickNameLookUpRequest nickNameLookUpRequest) {
        final List<NickNameLookUpResponse> response
                = teamAuthService.getMembersOfNickName(teamId, nickNameLookUpRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/teams/auth/{teamId}/teamCode")
    public ResponseEntity<Void> sendInvitation(
            @RequestBody InviteTeamRequest inviteTeamRequest,
            @PathVariable Long teamId) {
        teamAuthService.sendInviteEmail(teamId, inviteTeamRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/teams/auth/{teamId}/teamCode")
    public ResponseEntity<TeamCodeResponse> getTeamCode(
            @PathVariable Long teamId) {

        final TeamCodeResponse response = teamAuthService.getTeamCode(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
