package S11P12A708.A708.domain.study.repository.query;

public interface StudyQueryRepository {

    Integer findMaxTimesByYearAndMonth(Integer year, Integer month);

}
