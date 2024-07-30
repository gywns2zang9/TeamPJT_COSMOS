package S11P12A708.A708.domain.auth.controller;

import S11P12A708.A708.domain.auth.annotation.AuthUser;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.auth.request.LoginRequest;
import S11P12A708.A708.domain.auth.request.SignUpRequest;
import S11P12A708.A708.domain.auth.response.LoginResponse;
import S11P12A708.A708.domain.auth.service.AuthService;
import S11P12A708.A708.domain.auth.request.NickNameRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Boolean> signUp(@RequestBody SignUpRequest signUpRequest) {
        final boolean response = authService.signUp(signUpRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/check-nickname")
    public ResponseEntity<Boolean> confirmDuplicateNickName(@RequestBody NickNameRequest nickNameRequest) {
        final boolean response = authService.checkNickName(nickNameRequest.getNickName());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        final LoginResponse response = authService.login(loginRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/refresh")
    public String getRefreshToken(@AuthUser AuthUserDto authUser) {
        return authService.getRefreshToken(authUser);
    }
}