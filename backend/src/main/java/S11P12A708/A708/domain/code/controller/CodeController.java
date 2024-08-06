package S11P12A708.A708.domain.code.controller;

import S11P12A708.A708.domain.auth.annotation.AuthUser;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.code.request.ExecuteCodeRequest;
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
@RequestMapping("/codes")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<List<CodeYearFilterResponse>> getCodeFilter(@AuthUser AuthUserDto authUser, @PathVariable Long teamId) {
        List<CodeYearFilterResponse> response =  codeService.getCodeFilter(authUser, teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
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
