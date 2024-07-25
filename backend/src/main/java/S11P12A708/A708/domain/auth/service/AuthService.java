package S11P12A708.A708.domain.auth.service;

import S11P12A708.A708.common.error.exception.InvalidPasswordException;
import S11P12A708.A708.common.error.exception.UserNotFoundException;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    private final PasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private UserRepository userRepository;

    public AuthService(PasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
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