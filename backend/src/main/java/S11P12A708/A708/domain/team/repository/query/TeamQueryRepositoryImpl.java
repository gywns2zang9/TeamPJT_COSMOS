package S11P12A708.A708.domain.team.repository.query;

import static S11P12A708.A708.domain.team.entity.QTeam.team;
import static S11P12A708.A708.domain.team.entity.QTeamUser.teamUser;
import static S11P12A708.A708.domain.user.entity.QUser.user;

import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.entity.TeamUserRole;
import S11P12A708.A708.domain.user.entity.User;
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
    public Optional<List<Team>> findTeamsByUserId(Long userId) {
        // select * from team t join team_user tu on tu.user_id=1 where t.id = tu.team_id
        return Optional.of(queryFactory
                .selectFrom(team)
                .join(teamUser)
                .on(teamUser.user.id.eq(userId))
                .where(team.id.eq(teamUser.team.id))
                .fetch()
                .stream().toList());
    }

    @Override
    public List<User> findUsersByTeamId(Long id) {
        //SELECT u.* FROM user u JOIN teamuser tu ON u.id = tu.user_id WHERE tu.team_id = 1;
        return queryFactory
                .selectFrom(user)
                .join(teamUser)
                .on(teamUser.user.id.eq(user.id))
                .where(teamUser.team.id.eq(id))
                .fetch()
                .stream().toList();
    }

    @Override
    public TeamUser findLeaderUserByTeamId(Long teamId) {
        // SELECT * FROM team_user where team_id = 1 and role = "LEADER";
        return queryFactory
                .selectFrom(teamUser)
                .where(teamUser.team.id.eq(teamId), teamUser.role.eq(TeamUserRole.LEADER))
                .fetchOne();
    }

    @Override
    public TeamUser findTeamUserByIds(Long teamId, Long userId) {
        // SELECT * FROM team_user where user_id = 1 and team_id = 1;
        return queryFactory
                .selectFrom(teamUser)
                .where(teamUser.user.id.eq(userId), teamUser.team.id.eq(teamId))
                .fetchOne();
    }

}
