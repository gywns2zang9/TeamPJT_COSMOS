package S11P12A708.A708.domain.user.service;

import S11P12A708.A708.domain.auth.exception.InvalidPasswordException;
import S11P12A708.A708.domain.auth.service.AuthService;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import S11P12A708.A708.domain.user.request.ChangePwRequest;
import S11P12A708.A708.domain.user.request.ChangeUserRequest;
import S11P12A708.A708.domain.user.response.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserService {
    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final AuthService authService;

    public UserService(PasswordEncoder bCryptPasswordEncoder, UserRepository userRepository,
                       AuthService authService) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public UserInfo getUserInfoByUserId(Long userId) throws RuntimeException {
        final User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        return new UserInfo(user);
    }

    public UserInfo updateUserInfo(Long userId, ChangeUserRequest req) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        if (!req.getNickName().equals(user.getNickname()) && authService.checkNickName(req.getNickName())) {
            user.setNickname(req.getNickName());
        }
        user.setGitId(req.getGitId());
        user.setRepo(req.getRepo());
        user.setDescription(req.getDescription());
        userRepository.save(user);
        return new UserInfo(user);
    }

    public boolean changePassword(Long userId, ChangePwRequest req) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        boolean userCheck = user.checkPassword(req.getOldPassword(), bCryptPasswordEncoder);

        if (userCheck) {
            user.setPassword(req.getNewPassword());
            user.hashPassword(bCryptPasswordEncoder);
            userRepository.save(user);
            return true;
        }
        throw new InvalidPasswordException();
    }
}
