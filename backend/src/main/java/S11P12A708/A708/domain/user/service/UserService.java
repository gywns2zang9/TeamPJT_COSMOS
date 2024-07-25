package S11P12A708.A708.domain.user.service;

import S11P12A708.A708.common.error.exception.UserInvalidException;
import S11P12A708.A708.common.error.exception.UserNotFoundException;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import S11P12A708.A708.domain.user.response.UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserInfo getUserInfoByUserId(AuthUserDto authUser, Long userId) throws RuntimeException {
        final User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        log.info(String.valueOf(authUser.getId()));
        if (Objects.equals(authUser.getId(), userId)) return new UserInfo(user);

        throw new UserInvalidException();
    }

    public Optional<User> getUserByEmail(String email) throws RuntimeException {
        return userRepository.findByEmail(email);
    }
}
