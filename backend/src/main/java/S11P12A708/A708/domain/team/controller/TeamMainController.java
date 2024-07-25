package S11P12A708.A708.domain.team.controller;

import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.request.TeamLeaderRequest;
import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.response.TeamMemberResponse;
import S11P12A708.A708.domain.team.service.TeamMainService;
import S11P12A708.A708.domain.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<TeamDetailResponse> teamDetail(@PathVariable("teamId") Long teamId) {
        final TeamDetailResponse response = teamMainService.getTeamDetail(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/users")
    public ResponseEntity<List<TeamMemberResponse>> teamMembers(@PathVariable("teamId") Long teamId) {
        final List<TeamMemberResponse> response = teamMainService.getTeamMembers(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}")
    public ResponseEntity<Void> updateTeamDetail(
            @PathVariable("teamId") Long teamId,
            @RequestBody TeamInfoRequest request) {
        teamMainService.updateTeamDetail(teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}/leader")
    public ResponseEntity<Void> updateTeamLeader(
            @PathVariable("teamId") Long teamId,
            @RequestBody TeamLeaderRequest request) {
        teamMainService.updateTeamLeader(teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/leader")
    public ResponseEntity<Boolean> checkTeamLeader(@PathVariable("teamId") Long teamId) {
        final Long loginId = 1L; // TODO : 로그인된 유저 정보 가져오기
        final Boolean isLeader = teamMainService.checkTeamLeader(teamId, loginId);
        return new ResponseEntity<>(isLeader, HttpStatus.OK);
    }

    @DeleteMapping("/teams/{teamId}")
    public ResponseEntity<Void> exitTeam(@PathVariable("teamId") Long teamId) {
        final Long loginId = 1L; // TODO : 로그인된 유저 정보 가져오기
        teamMainService.exitTeam(teamId, loginId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}