package S11P12A708.A708.domain.user.service;

import S11P12A708.A708.domain.auth.exception.InvalidPasswordException;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import S11P12A708.A708.domain.user.request.ChangePwRequest;
import S11P12A708.A708.domain.user.response.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class UserService {
    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;

    public UserService(PasswordEncoder bCryptPasswordEncoder, UserRepository userRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
    }

    public UserInfo getUserInfoByUserId(Long userId) throws RuntimeException {
        final User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        return new UserInfo(user);
    }

    public Optional<User> getUserByEmail(String email) throws RuntimeException {
        return userRepository.findByEmail(email);
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
