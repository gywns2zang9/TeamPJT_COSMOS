package S11P12A708.A708.domain.auth.service;

import S11P12A708.A708.domain.auth.exception.*;
import S11P12A708.A708.domain.auth.oauth.request.OAuthLoginParams;
import S11P12A708.A708.domain.auth.oauth.response.OAuthInfoResponse;
import S11P12A708.A708.domain.authcode.entity.AuthType;
import S11P12A708.A708.domain.authcode.entity.Authcode;
import S11P12A708.A708.domain.authcode.repository.AuthCodeRepository;
import S11P12A708.A708.domain.auth.exception.InvalidNickNameException;
import S11P12A708.A708.domain.auth.exception.NicknameAlreadyExistException;
import S11P12A708.A708.domain.user.exception.UserAlreadyExistException;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.common.util.JwtTokenUtil;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.auth.request.LoginRequest;
import S11P12A708.A708.domain.auth.request.SignUpRequest;
import S11P12A708.A708.domain.auth.response.LoginResponse;
import S11P12A708.A708.domain.auth.oauth.service.RequestOAuthInfoService;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.entity.UserType;
import S11P12A708.A708.domain.user.repository.UserRepository;
import S11P12A708.A708.domain.user.response.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
public class AuthService {
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final AuthCodeRepository authCodeRepository;
    private final RequestOAuthInfoService requestOAuthInfoService;

    public AuthService(PasswordEncoder bCryptPasswordEncoder, JwtTokenUtil jwtTokenUtil,
                       UserRepository userRepository, AuthCodeRepository authCodeRepository,
                       RequestOAuthInfoService requestOAuthInfoService) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.authCodeRepository = authCodeRepository;
        this.requestOAuthInfoService = requestOAuthInfoService;
    }

    public LoginResponse socialLogin(OAuthLoginParams params) {
        OAuthInfoResponse oAuthInfoResponse = requestOAuthInfoService.request(params);
        UserInfo userInfo = new UserInfo(findOrCreateSocialUser(oAuthInfoResponse));

        String accessToken = jwtTokenUtil.createAccessToken(String.valueOf(userInfo.getUserId()));
        String refreshToken = jwtTokenUtil.createRefreshToken(String.valueOf(userInfo.getUserId()));

        return new LoginResponse(accessToken, refreshToken, userInfo);
    }

    private User findOrCreateSocialUser(OAuthInfoResponse res) {
        Optional<User> user = userRepository.findByEmail(res.getEmail());
        if (user.isPresent()) {
            User foundUser = user.get();
            if (res.userType() == foundUser.getType()) return foundUser;
            else errIfDuplicateEmail(foundUser);
        }

        return createSocialUser(res);
    }

    private User createSocialUser(OAuthInfoResponse res) {
        String nickname = generateNickname();
        while (userRepository.findByNickname(nickname).isPresent()) {
            nickname = generateNickname();
        }

        User user = new User(res.getEmail(), res.userType(), nickname);
        userRepository.save(user);

        return userRepository.findByEmail(res.getEmail()).orElseThrow(KakaoAlreadyExistException::new);
    }

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int LENGTH = 10;
    private final Random random = new SecureRandom();

    private String generateNickname() {
        return IntStream.range(0, LENGTH)
                .mapToObj(i -> String.valueOf(CHARACTERS.charAt(random.nextInt(CHARACTERS.length()))))
                .collect(Collectors.joining());
    }

    @Transactional
    public boolean signUp(SignUpRequest req) {
        Optional<User> foundUser = userRepository.findByEmail(req.getEmail());
        foundUser.ifPresent(this::errIfDuplicateEmail);

        if (errIfNotVerifyEmail(req.getEmail()) && checkNickName(req.getNickName())
                && pwCheck(req.getPassword())) {
            User user = new User(req.getEmail(), req.getPassword(), UserType.NORMAL, req.getNickName());
            user.hashPassword(bCryptPasswordEncoder);

            authCodeRepository.deleteByEmail(req.getEmail());
            userRepository.save(user);

            return true;
        } else {
            throw new FailSignUpException();
        }
    }

    private void errIfDuplicateEmail(User user) {
        if (user.getType() == UserType.NORMAL) {
            throw new UserAlreadyExistException();
        } else if (user.getType() == UserType.KAKAO) {
            throw new KakaoAlreadyExistException();
        } else if (user.getType() == UserType.NAVER) {
            throw new NaverAlreadyExistException();
        }
    }

    private boolean errIfNotVerifyEmail(String email) throws AuthNecessaryException {
        Optional<Authcode> foundAuthCodeUser = authCodeRepository.findByEmail(email);

        if (foundAuthCodeUser.isPresent()) {
            Authcode authcode = foundAuthCodeUser.get();

            if (authcode.getType() == AuthType.SIGN_UP) {
                throw new AuthNecessaryException();
            } else return authcode.getType() == AuthType.SIGN_UP_ABLE;
        }
        throw new AuthNecessaryException();
    }

    public boolean pwCheck(String password) {
        // 8~15자리 사이 숫자, 특수문자, 영어 1개 이상씩
        String pattern = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,13}$";
        if (Pattern.compile(pattern).matcher(password).matches()) return true;
        throw new InvalidPasswordException();
    }

    public boolean checkNickName(String nickName) {
        return errIfDuplicateNickname(nickName) && nickNameFormat(nickName);
    }

    private boolean errIfDuplicateNickname(String nickname) {
        Optional<User> foundNicknameUser = userRepository.findByNickname(nickname);

        if (foundNicknameUser.isPresent()) {
            throw new NicknameAlreadyExistException();
        } else return true;
    }

    private boolean nickNameFormat(String nickname) {
        // 2~12자리
        if (nickname.length() >= 2 && nickname.length() <= 12) return true;
        throw new InvalidNickNameException();
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(UserNotFoundException::new);
        if (user.getType() != UserType.NORMAL) errIfDuplicateEmail(user);

        boolean userCheck = user.checkPassword(req.getPassword(), bCryptPasswordEncoder);

        if (userCheck) {
            String accessToken = jwtTokenUtil.createAccessToken(String.valueOf(user.getId()));
            String refreshToken = jwtTokenUtil.createRefreshToken(String.valueOf(user.getId()));
            UserInfo userInfo = new UserInfo(user);

            return new LoginResponse(accessToken, refreshToken, userInfo);
        }

        throw new InvalidPasswordException();
    }

    public String getRefreshToken(AuthUserDto authUser) {
        return jwtTokenUtil.createAccessToken(String.valueOf(authUser.getId()));
    }
}