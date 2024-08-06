package S11P12A708.A708.domain.code.repository.query;

import S11P12A708.A708.domain.code.response.CodeFilterResponse;
import S11P12A708.A708.domain.study.entity.Study;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static S11P12A708.A708.domain.code.entity.QCode.code;
import static S11P12A708.A708.domain.file.entity.QFile.file;
import static S11P12A708.A708.domain.folder.entity.QFolder.folder;
import static S11P12A708.A708.domain.problem.entity.QProblem.problem;
import static S11P12A708.A708.domain.study.entity.QStudy.study;

@Repository
@RequiredArgsConstructor
public class CodeQueryRepositoryImpl implements CodeQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Study> findStudiesFilter(Long teamId) {
        return queryFactory
                .selectFrom(study)
                .where(study.team.id.eq(teamId))
                .fetch()
                .stream().toList();
    }

    @Override
    public List<CodeFilterResponse> findCodesListByStudyId(Long studyId, Long userId) {
        return queryFactory
                .select(code.id, problem.name, file.name)
                .from(code)
                .join(file).on(file.code.id.eq(code.id))
                .join(folder).on(file.folder.id.eq(folder.id))
                .join(problem).on(folder.problem.id.eq(problem.id))
                .where(problem.study.id.eq(studyId), file.user.id.eq(userId))
                .fetch()
                .stream()
                .map(tuple -> new CodeFilterResponse(
                        4,
                        tuple.get(code.id),
                        tuple.get(problem.name),
                        tuple.get(file.name)
                ))
                .collect(Collectors.toList());
    }

}
