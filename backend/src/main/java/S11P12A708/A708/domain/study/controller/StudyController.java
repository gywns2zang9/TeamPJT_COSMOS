package S11P12A708.A708.domain.study.controller;

import S11P12A708.A708.domain.study.request.StudyCreateRequest;
import S11P12A708.A708.domain.study.service.StudyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;

    @PostMapping("/teams/{teamId}/meetings")
    public ResponseEntity<Void> createStudy(
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody StudyCreateRequest request) {
        studyService.createStudy(teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/teams/{teamId}/meetings/{meetingId}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable("teamId") Long teamId,
            @PathVariable("meetingId") Long meetingId) {
        studyService.deleteStudy(teamId, meetingId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}