package S11P12A708.A708.domain.study.response;

import S11P12A708.A708.domain.study.entity.Study;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class StudyResponse {

    private Long id;
    private Integer year;
    private Integer month;
    private Integer times;

    public StudyResponse(Long id, Integer year, Integer month, Integer times) {
        this.id = id;
        this.year = year;
        this.month = month;
        this.times = times;
    }

    public static StudyResponse of(Study study) {
        return new StudyResponse(study.getId(), study.getYear(), study.getMonth(), study.getTimes());
    }

}