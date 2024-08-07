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
    private List<SolveStatus> status;

    public FileProblemResponse(SiteInfoType site, Integer number, String name, String level, String url, List<SolveStatus> status) {
        this.site = site;
        this.number = number;
        this.name = name;
        this.level = level;
        this.url = url;
        this.status = status;
    }

    public static FileProblemResponse of(Problem problem, List<SolveStatus> status) {
        return new FileProblemResponse(
                problem.getSite(),
                problem.getNumber(),
                problem.getName(),
                problem.getLevel(),
                problem.getUrl(),
                status
        );
    }

}