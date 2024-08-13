package S11P12A708.A708.domain.problem.response;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CrawlCodeResponse {

    private String result;
    private String message;

    public CrawlCodeResponse(String result, String message) {
        this.result = result;
        this.message = message;
    }

    public static CrawlCodeResponse createSuccess() {
        return new CrawlCodeResponse("success", "");
    }

    public static CrawlCodeResponse createFailure(String message) {
        return new CrawlCodeResponse("fail", message);
    }

}
