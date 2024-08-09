package S11P12A708.A708.common.util;

import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.problem.entity.SiteInfoType;
import S11P12A708.A708.domain.problem.exception.ProblemNotExistException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
@Component
public class ProblemCrawler {
    private static final String BOJ_API_URL = "https://solved.ac/api/v3/problem/show";
    private static final String BOJ_Problem_URL = "https://www.acmicpc.net/problem/";

    public static BojProblem getBojProblem(int number){
        try {
            // API 호출
            String jsonResponse = sendGetRequest(number);
            if (jsonResponse.equals("fail")) return null;

            // JSON 데이터 처리
            JSONObject jsonObject = new JSONObject(jsonResponse);
            String title = jsonObject.getString("titleKo");
            String level = getRating(jsonObject.getInt("level"));
            String url = new StringBuilder().append(BOJ_Problem_URL).append(number).toString();
            return new BojProblem(SiteInfoType.BAEKJOON,number,title,level,url);
            // 필요한 다른 필드를 추가로 출력할 수 있습니다.
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String sendGetRequest(int problemId) throws Exception {
        String url = BOJ_API_URL + "?problemId=" + problemId;
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("GET");

        int responseCode = con.getResponseCode();
        System.out.println("GET Response Code :: " + responseCode);
        if (responseCode == 404) return "fail";

        // 명시적으로 UTF-8 인코딩을 설정합니다.
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
        String inputLine;
        StringBuilder response = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        return response.toString();
    }


    public static String getRating(int value) {
        if (value < 0 || value > 30) {
            throw new IllegalArgumentException("Value must be between 0 and 30.");
        }

        // Define ratings for the values
        switch (value) {
            case 0:
                return "unrated";
            case 1:
                return "Bronze V";
            case 2:
                return "Bronze IV";
            case 3:
                return "Bronze III";
            case 4:
                return "Bronze II";
            case 5:
                return "Bronze I";
            case 6:
                return "Silver V";
            case 7:
                return "Silver IV";
            case 8:
                return "Silver III";
            case 9:
                return "Silver II";
            case 10:
                return "Silver I";
            case 11:
                return "Gold V";
            case 12:
                return "Gold IV";
            case 13:
                return "Gold III";
            case 14:
                return "Gold II";
            case 15:
                return "Gold I";
            case 16:
                return "Platinum V";
            case 17:
                return "Platinum IV";
            case 18:
                return "Platinum III";
            case 19:
                return "Platinum II";
            case 20:
                return "Platinum I";
            case 21:
                return "Diamond V";
            case 22:
                return "Diamond IV";
            case 23:
                return "Diamond III";
            case 24:
                return "Diamond II";
            case 25:
                return "Diamond I";
            case 26:
                return "Ruby V";
            case 27:
                return "Ruby IV";
            case 28:
                return "Ruby III";
            case 29:
                return "Ruby II";
            case 30:
                return "Ruby I";
            default:
                throw new IllegalStateException("Unexpected value: " + value);
        }
    }
}
