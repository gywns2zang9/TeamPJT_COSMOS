package S11P12A708.A708.domain.problem.repository.query;

import S11P12A708.A708.domain.file.response.SolveStatusResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static S11P12A708.A708.domain.problem.entity.QProblemUser.problemUser;
import static S11P12A708.A708.domain.user.entity.QUser.user;

@Repository
@RequiredArgsConstructor
public class ProblemQueryRepositoryImpl implements ProblemQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<SolveStatusResponse> findSolveUsersByProblemId(Long problemId) {
        return queryFactory
                .select(Projections.constructor(SolveStatusResponse.class,
                        user.id,
                        user.nickname,
                        problemUser.status,
                        problemUser.file.id))
                .from(problemUser)
                .join(problemUser.user, user)
                .where(problemUser.problem.id.eq(problemId))
                .fetch();
    }

}
