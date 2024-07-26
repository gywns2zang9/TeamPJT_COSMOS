package S11P12A708.A708.domain.authcode.repository.query;

import S11P12A708.A708.domain.authcode.entity.AuthType;
import S11P12A708.A708.domain.authcode.entity.Authcode;

import java.util.Optional;

public interface AuthCodeQueryRepository {
    Optional<Authcode> findByEmailAndType(String email, AuthType type);
}
