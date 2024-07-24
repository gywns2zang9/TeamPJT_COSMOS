package S11P12A708.A708.domain.team.controller;

import S11P12A708.A708.domain.team.response.TeamDetailResponse;
import S11P12A708.A708.domain.team.service.TeamMainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TeamMainController {

    private final TeamMainService teamMainService;

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<TeamDetailResponse> teamDetail(@PathVariable("teamId") Long teamId) {
        final TeamDetailResponse response = teamMainService.getTeamDetail(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}