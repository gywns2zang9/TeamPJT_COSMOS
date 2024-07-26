package S11P12A708.A708.domain.authcode.controller;

import S11P12A708.A708.domain.authcode.request.SendEmailRequest;
import S11P12A708.A708.domain.authcode.response.SendEmailResponse;
import S11P12A708.A708.domain.authcode.service.AuthCodeService;
import S11P12A708.A708.domain.authcode.entity.AuthType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth-codes")
@RequiredArgsConstructor
public class AuthCodeController {

    private final AuthCodeService authCodeService;

    @PostMapping("/send-code")
    public SendEmailResponse sendEmail(@RequestBody SendEmailRequest request) {
        return authCodeService.generateAuthCode(request.getEmail(), AuthType.SIGN_UP);
    }
}


