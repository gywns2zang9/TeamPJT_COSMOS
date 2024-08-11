package S11P12A708.A708.domain.team.controller;

import S11P12A708.A708.domain.auth.annotation.AuthUser;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.request.TeamLeaderRequest;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.domain.team.service.TeamMainService;
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
public class TeamMainController {

    private final TeamMainService teamMainService;

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<TeamDetailResponse> getTeamDetail(@PathVariable("teamId") Long teamId) {
        final TeamDetailResponse response = teamMainService.getTeamDetail(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/users")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(@PathVariable("teamId") Long teamId) {
        final List<TeamMemberResponse> response = teamMainService.getTeamMembers(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}")
    public ResponseEntity<Void> updateTeamDetail(
            @AuthUser AuthUserDto authUser,
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody TeamInfoRequest request) {
        teamMainService.updateTeamDetail(authUser.getId(), teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}/leader")
    public ResponseEntity<Void> updateTeamLeader(
            @AuthUser AuthUserDto authUser,
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody TeamLeaderRequest request) {
        teamMainService.updateTeamLeader(authUser.getId(), teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/leader")
    public ResponseEntity<Boolean> checkTeamLeader(@AuthUser AuthUserDto authUser, @PathVariable("teamId") Long teamId) {
        final Boolean isLeader = teamMainService.checkTeamLeader(teamId, authUser.getId());
        return new ResponseEntity<>(isLeader, HttpStatus.OK);
    }

    @DeleteMapping("/teams/{teamId}")
    public ResponseEntity<Void> exitTeam(@AuthUser AuthUserDto authUser, @PathVariable("teamId") Long teamId) {
        teamMainService.exitTeam(teamId, authUser.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

}