package S11P12A708.A708.domain.code.controller;

import S11P12A708.A708.domain.code.request.ExecuteCodeRequest;
import S11P12A708.A708.domain.code.request.PatchCodeRequest;
import S11P12A708.A708.domain.code.response.CodeResponse;
import S11P12A708.A708.domain.code.response.CodeYearFilterResponse;
import S11P12A708.A708.domain.code.response.ExecuteCodeResponse;
import S11P12A708.A708.domain.code.service.CodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @GetMapping("/teams/{teamId}/users/{userId}/codes")
    public ResponseEntity<List<CodeYearFilterResponse>> getCodeFilter(
            @PathVariable Long teamId, @PathVariable Long userId) {
        List<CodeYearFilterResponse> response =  codeService.getCodeFilter(teamId, userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/codes/{codeId}")
    public ResponseEntity<CodeResponse> getCode(
            @PathVariable Long teamId, @PathVariable Long codeId) {
        CodeResponse response = codeService.getCode(teamId, codeId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}/codes/{codeId}")
    public ResponseEntity<Void> patchCode(
            @PathVariable Long teamId, @PathVariable Long codeId, @RequestBody PatchCodeRequest patchCodeRequest) {
        codeService.storeCode(teamId, codeId, patchCodeRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/execute")
    public ResponseEntity<ExecuteCodeResponse> executeCode(@RequestBody ExecuteCodeRequest executeCodeRequest) {
        try {
            ExecuteCodeResponse response = codeService.getExecuteResult(executeCodeRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

}
