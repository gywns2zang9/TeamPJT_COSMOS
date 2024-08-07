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
    private Integer number;
    private String name;
    private String level;
    private String url;
    private List<SolveStatus> statuses;

    public FileProblemResponse(SiteInfoType site, Integer number, String name, String level, String url, List<SolveStatus> statuses) {
        this.site = site;
        this.number = number;
        this.name = name;
        this.level = level;
        this.url = url;
        this.statuses = statuses;
    }

    public static FileProblemResponse of(Problem problem, List<SolveStatus> statuses) {
        return new FileProblemResponse(
                problem.getSite(),
                problem.getNumber(),
                problem.getName(),
                problem.getLevel(),
                problem.getUrl(),
                statuses
        );
    }

}