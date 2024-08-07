package S11P12A708.A708.domain.study.repository.query;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static S11P12A708.A708.domain.study.entity.QStudy.study;

@Repository
@RequiredArgsConstructor
public class StudyQueryRepositoryImpl implements StudyQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Integer findMaxTimesByYearAndMonth(Long teamId, Integer year, Integer month) {
        return queryFactory
                .select(study.times.max().coalesce(0))
                .from(study)
                .where(study.year.eq(year)
                        .and(study.month.eq(month)).and(study.team.id.eq(teamId)))
                .fetchOne();
    }

}
