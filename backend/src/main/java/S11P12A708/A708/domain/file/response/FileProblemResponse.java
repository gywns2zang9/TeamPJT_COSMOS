package S11P12A708.A708.domain.file.response;

import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.SiteInfoType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class FileProblemResponse {

    private SiteInfoType site;
    private Long problemId;
    private Integer number;
    private String name;
    private String level;
    private String url;
    private List<SolveStatusResponse> statuses;

    public FileProblemResponse(SiteInfoType site, Long problemId, Integer number, String name, String level, String url, List<SolveStatusResponse> statuses) {
        this.site = site;
        this.problemId = problemId;
        this.number = number;
        this.name = name;
        this.level = level;
        this.url = url;
        this.statuses = statuses;
    }

    public static FileProblemResponse of(Problem problem, List<SolveStatusResponse> statuses) {
        return new FileProblemResponse(
                problem.getSite(),
                problem.getId(),
                problem.getNumber(),
                problem.getName(),
                problem.getLevel(),
                problem.getUrl(),
                statuses
        );
    }

}