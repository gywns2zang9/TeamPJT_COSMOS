package S11P12A708.A708.common.util;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.entity.Language;
import S11P12A708.A708.domain.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;


@Slf4j
@Component
public class CodeCrawler {

    private boolean checkUserInfoForCrawling(User user) {
        return ((user.getGitId() == null || user.getGitId().isEmpty()) ||
                (user.getRepo() == null || user.getRepo().isEmpty()));
    }

    public Code createByCrawler(User user, int pbNum)  {
        if(checkUserInfoForCrawling(user)) return Code.createBasic();

        final String url = getBojUrl(user, pbNum);
        for(Language lang : Language.values()) {
            final String newUrl = url + lang.getExtension();
            final String codeContent = getCodeContent(newUrl);
            if(codeContent != null) return new Code(codeContent, lang);
        }
        return Code.createBasic();
    }

    private String getBojUrl(User user, int pbNum) {
        // Jsoup으로 HTML 파싱
        String url = "https://github.com/name/repo/blob/main/%EB%B0%B1%EC%A4%80/tier/number/lang";

        BojProblem temp = ProblemCrawler.getBojProblem(pbNum);
        String tierCheck = temp.getLevel();
        if(temp.getLevel().contains("Gold")){
            tierCheck = "Gold";
        }else if(temp.getLevel().contains("Silver")){
            tierCheck = "Silver";
        }else if(temp.getLevel().contains("Bronze")) {
            tierCheck = "Bronze";
        }else if(temp.getLevel().contains("Platinum")) {
            tierCheck = "Platinum";
        }else if(temp.getLevel().contains("Diamond")) {
            tierCheck = "Diamond";
        }else if(temp.getLevel().contains("Ruby")) {
            tierCheck = "Ruby";
        }

        return url.replace("name", user.getGitId())
                .replace("repo", user.getRepo())
                .replace("tier",tierCheck)
                .replace("number",temp.getNumber()+".%20"+temp.getName())
                .replace("lang",temp.getName());
    }

    public String handleEscapes(String input) {
        StringBuilder sb = new StringBuilder();
        int length = input.length();
        for (int i = 0; i < length; i++) {
            char currentChar = input.charAt(i);
            if (currentChar == '\\') {
                if (i + 1 < length) {
                    char nextChar = input.charAt(i + 1);
                    switch (nextChar) {
                        case 'n':
                            sb.append('\n');
                            break;
                        case 't':
                            sb.append('\t');
                            break;
                        case 'r':
                            sb.append('\r');
                            break;
                        case '\\':
                            sb.append('\\');
                            break;
                        case '\"':
                            sb.append('\"');
                            break;
                        case '\'':
                            sb.append('\'');
                            break;
                        default:
                            sb.append(currentChar); // 백슬래시를 그대로 추가
                            break;
                    }
                    i++; // 다음 문자도 처리했으므로 인덱스 증가
                } else {
                    sb.append(currentChar); // 마지막 문자가 백슬래시인 경우
                }
            } else {
                sb.append(currentChar); // 이스케이프 문자가 아닌 경우
            }
        }
        return sb.toString();
    }

    public String getCodeContent(String url)  {
        try {
            Document doc = Jsoup.connect(url.replace("%20", "%E2%80%85").replace(" ", "%E2%80%85").replace("-", "%EF%BC%8D")).get();
            // <script> 태그의 data-target 속성 값이 'react-app.embeddedData'인 태그를 찾기
            Elements scriptTags = doc.select("script[data-target=react-app.embeddedData]");

            for (Element scriptTag : scriptTags) {
                // script 태그의 JSON 데이터 추출
                String jsonData = scriptTag.html();

                // JSON 파싱 (여기서는 JSON 데이터가 복잡할 수 있으니, 실제 데이터에 맞게 JSON 파서 사용 필요)
                // 여기서는 JSON 데이터에서 'blob' > 'rawLines'를 직접 추출하여 사용한다고 가정합니다.

                // 예제 JSON 데이터 파싱 (여기서는 실제 JSON 파서 필요)
                // 실제 JSON 파서를 사용하여 'blob.rawLines' 데이터를 추출합니다.
                JSONObject jsonObject = new JSONObject(jsonData);
                JSONObject payload = jsonObject.getJSONObject("payload");
                JSONObject blob = payload.getJSONObject("blob");
                String content = blob.get("rawLines").toString();
                String a = content.substring(2, content.length() - 2);
                String[] arr = a.split("\",\"");

                StringBuilder res = new StringBuilder();
                for(String s : arr) {
                    String k = handleEscapes(s);
                    res.append(k).append("\n");
                }

                return res.toString();
            }
        } catch (Exception e) { return null; }
        return null;
    }

}
