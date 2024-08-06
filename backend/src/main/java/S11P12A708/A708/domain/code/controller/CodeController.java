package S11P12A708.A708.domain.code.controller;

import S11P12A708.A708.domain.code.request.ExecuteCodeRequest;
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
