package S11P12A708.A708.domain.authcode.repository.query;

import static S11P12A708.A708.domain.authcode.entity.QAuthcode.authcode;

import S11P12A708.A708.domain.authcode.entity.AuthType;
import S11P12A708.A708.domain.authcode.entity.Authcode;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
@RequiredArgsConstructor
public class AuthCodeQueryRepositoryImpl implements AuthCodeQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<Authcode> findByEmailAndType(String email, AuthType type) {
        return Optional.ofNullable(queryFactory
                .selectFrom(authcode)
                .where(authcode.email.eq(email).and(authcode.type.eq(type)))
                .fetchOne());
    }
}
