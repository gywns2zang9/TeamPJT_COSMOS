package S11P12A708.A708.domain.team.entity;

import S11P12A708.A708.domain.team.exception.LeaderNotException;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

import static S11P12A708.A708.domain.team.entity.TeamUserRole.LEADER;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class TeamUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TeamUserRole role;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;

    public TeamUser(User user, Team team, TeamUserRole role) {
        this.user = user;
        this.team = team;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    public Boolean isLeader() {
        return this.role.equals(LEADER);
    }

    public Boolean sameUser(Long userId) {
        return this.user.getId().equals(userId);
    }

    public void changeRole(final TeamUserRole role) {
        this.role = role;
        this.modifiedAt = LocalDateTime.now();
    }

    public void verifyTeamLeader() {
        if(!this.role.equals(LEADER)) throw new LeaderNotException();
    }
}
