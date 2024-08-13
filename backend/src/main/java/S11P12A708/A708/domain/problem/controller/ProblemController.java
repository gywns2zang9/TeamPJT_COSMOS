package S11P12A708.A708.domain.problem.controller;

import S11P12A708.A708.domain.problem.request.CrawlCodeRequest;
import S11P12A708.A708.domain.problem.request.CreateProblemRequest;
import S11P12A708.A708.domain.problem.request.DeleteProblemRequest;
import S11P12A708.A708.domain.problem.response.CrawlCodeResponse;
import S11P12A708.A708.domain.problem.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping("/teams/{teamId}/problems")
    public ResponseEntity<Void> createProblem(@PathVariable Long teamId,
                                              @Valid @RequestBody CreateProblemRequest createProblemRequest) {
        problemService.createProblem(teamId, createProblemRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/teams/{teamId}/problems/{problemId}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long teamId,
                                              @PathVariable Long problemId,
                                              @Valid @RequestBody DeleteProblemRequest req) {
        problemService.deleteProblem(teamId, problemId, req);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/teams/{teamId}/problems/code")
    public ResponseEntity<CrawlCodeResponse> crawlAndSaveCode(@PathVariable Long teamId,
                                                              @Valid @RequestBody CrawlCodeRequest crawlCodeRequest) {
        final CrawlCodeResponse response = problemService.crawlCode(teamId, crawlCodeRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}


