package S11P12A708.A708.common.database;

import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.entity.UserType;
import S11P12A708.A708.domain.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    private final PasswordEncoder bCryptPasswordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            createTestUser("test");
            createTestUser("test1");
            createTestUser("test2");
        }
    }

    private void createTestUser(String testName) {
        User user = new User(testName, testName, UserType.NORMAL, testName);
        user.hashPassword(bCryptPasswordEncoder);
        userRepository.save(user);
    }
}