package S11P12A708.A708.domain.file.response;

import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.SiteInfoType;
import S11P12A708.A708.domain.study.entity.Study;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class OverViewFileProblemResponse {

    private SiteInfoType site;
    private Long problemId;
    private Integer number;
    private String name;
    private String level;
    private String url;
    private String studyDateInfo;
    private List<SolveStatusResponse> statuses;

    public OverViewFileProblemResponse(SiteInfoType site, Long problemId, Integer number, String name, String level, String url, String studyDateInfo, List<SolveStatusResponse> statuses) {
        this.site = site;
        this.problemId = problemId;
        this.number = number;
        this.name = name;
        this.level = level;
        this.url = url;
        this.studyDateInfo = studyDateInfo;
        this.statuses = statuses;
    }

    public static OverViewFileProblemResponse of(Problem problem, Study study, List<SolveStatusResponse> statuses) {
        return new OverViewFileProblemResponse(
                problem.getSite(),
                problem.getId(),
                problem.getNumber(),
                problem.getName(),
                problem.getLevel(),
                problem.getUrl(),
                study.getStudyDateInfo(),
                statuses
        );
    }

}