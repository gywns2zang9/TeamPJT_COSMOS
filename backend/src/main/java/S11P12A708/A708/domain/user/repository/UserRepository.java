package S11P12A708.A708.domain.user.repository;

import S11P12A708.A708.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
