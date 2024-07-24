package S11P12A708.A708.domain.team.repository.query;

import static S11P12A708.A708.domain.team.entity.QTeam.team;
import static S11P12A708.A708.domain.team.entity.QTeamUser.teamUser;

import S11P12A708.A708.domain.team.entity.Team;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TeamQueryRepositoryImpl implements TeamQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<List<Team>> findAllByUserId(Long userId) {
        return Optional.ofNullable(queryFactory
                .selectFrom(team)
                .join(teamUser)
                .on(teamUser.user.id.eq(userId))
                .fetch()
                .stream().toList());
    }

}
