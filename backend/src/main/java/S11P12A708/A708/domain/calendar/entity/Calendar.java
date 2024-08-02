package S11P12A708.A708.domain.calendar.entity;

import S11P12A708.A708.domain.team.entity.Team;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
@EntityListeners(AuditingEntityListener.class)
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String memo;

    @Column(nullable = false)
    private LocalDateTime time;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    public Calendar(String title, String memo, LocalDateTime time, Team team) { // 생성자 수정
        this.title = title;
        this.memo = memo;
        this.time = time;
        this.team = team;
        this.createdAt = LocalDateTime.now();
    }

    public void update(Calendar updateCalendar) {
        this.title = updateCalendar.getTitle();
        this.memo = updateCalendar.getMemo();
        this.time = updateCalendar.getTime();
    }

}