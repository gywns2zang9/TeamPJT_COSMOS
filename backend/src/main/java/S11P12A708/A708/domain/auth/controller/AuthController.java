package S11P12A708.A708.domain.auth.controller;

import S11P12A708.A708.common.error.exception.UserNotFoundException;
import S11P12A708.A708.domain.auth.annotation.AuthUser;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.auth.request.LoginRequest;
import S11P12A708.A708.domain.auth.request.SignUpRequest;
import S11P12A708.A708.domain.auth.response.LoginResponse;
import S11P12A708.A708.domain.auth.service.AuthService;
import S11P12A708.A708.domain.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public boolean signUp(@RequestBody SignUpRequest signUpRequest) {
        log.info("회원가입 테스트");
        return authService.signUp(signUpRequest);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        log.info("로그인 테스트");
        return authService.login(loginRequest);
    }

    @GetMapping("/refresh")
    public String refreshToken(@AuthUser AuthUserDto authUser) {
        log.info("재발급 테스트");
        return authService.refreshToken(authUser);
    }
}