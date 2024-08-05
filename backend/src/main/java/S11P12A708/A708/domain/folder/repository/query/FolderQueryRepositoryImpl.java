package S11P12A708.A708.domain.folder.repository.query;

import S11P12A708.A708.domain.folder.entity.Folder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static S11P12A708.A708.domain.folder.entity.QFolder.folder;

@Repository
@RequiredArgsConstructor
public class FolderQueryRepositoryImpl implements FolderQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<Folder> findRootFolderByTeam(Long teamId) {
        return Optional.ofNullable(queryFactory
                .selectFrom(folder)
                .where(folder.team.id.eq(teamId), folder.parentFolder.isNull())
                .fetchOne());
    }

}
