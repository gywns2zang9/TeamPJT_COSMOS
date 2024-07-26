package S11P12A708.A708.domain.auth.service;

import S11P12A708.A708.domain.auth.exception.InvalidPasswordException;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.common.util.JwtTokenUtil;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.auth.request.LoginRequest;
import S11P12A708.A708.domain.auth.request.SignUpRequest;
import S11P12A708.A708.domain.auth.response.LoginResponse;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.entity.UserType;
import S11P12A708.A708.domain.user.repository.UserRepository;
import S11P12A708.A708.domain.user.response.UserInfo;
import S11P12A708.A708.domain.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthService(PasswordEncoder bCryptPasswordEncoder, JwtTokenUtil jwtTokenUtil,
                       UserService userService, UserRepository userRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // 로그인 테스트용
    public boolean signUp(SignUpRequest req) {
        User user = userService.getUserByEmail(req.getEmail())
                .orElse(new User(req.getEmail(), req.getPassword(), UserType.NORMAL, req.getNickName()));

        user.hashPassword(bCryptPasswordEncoder);
        userRepository.save(user);

        return true;
    }

    public LoginResponse login(LoginRequest req) {
        User user = userService.getUserByEmail(req.getEmail()).orElseThrow(UserNotFoundException::new);
        boolean userCheck = user.checkPassword(req.getPassword(), bCryptPasswordEncoder);

        if (userCheck) {
            String accessToken = jwtTokenUtil.createAccessToken(req.getEmail());
            String refreshToken = jwtTokenUtil.createRefreshToken(req.getEmail());
            UserInfo userInfo = new UserInfo(user);

            return new LoginResponse(accessToken, refreshToken, userInfo);
        }

        throw new InvalidPasswordException();
    }

    public String getRefreshToken(AuthUserDto authUser) {
        return jwtTokenUtil.createAccessToken(authUser.getEmail());
    }
}