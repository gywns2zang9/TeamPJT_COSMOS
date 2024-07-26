package S11P12A708.A708.domain.authcode.controller;

import S11P12A708.A708.domain.authcode.request.VerifyAuthCodeRequest;
import S11P12A708.A708.domain.authcode.request.SendEmailRequest;
import S11P12A708.A708.domain.authcode.response.SendEmailResponse;
import S11P12A708.A708.domain.authcode.service.AuthCodeService;
import S11P12A708.A708.domain.authcode.entity.AuthType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth-codes")
@RequiredArgsConstructor
public class AuthCodeController {

    private final AuthCodeService authCodeService;

    @PostMapping("/send-code")
    public ResponseEntity<SendEmailResponse> sendSignUpEmail(@RequestBody SendEmailRequest request) {
        final SendEmailResponse response = authCodeService.generateAuthCode(request.getEmail(), AuthType.SIGN_UP);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/verify-code")
    public ResponseEntity<Boolean> verifySignUpAuthCode(@RequestBody VerifyAuthCodeRequest request) {
        final boolean response = authCodeService.verifyAuthCode(request, AuthType.SIGN_UP);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}


