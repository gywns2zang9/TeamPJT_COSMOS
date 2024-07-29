package S11P12A708.A708.domain.calendar.repository;

import S11P12A708.A708.domain.calendar.entity.Calendar;
import S11P12A708.A708.domain.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    List<Calendar> findByTeam(Team team);
}
