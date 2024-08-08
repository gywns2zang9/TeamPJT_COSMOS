package S11P12A708.A708.common.util;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URL;

@Component
public class ReadmeCrawler {

    public static void main(String[] args) {
        System.out.println(ReadmeCrawler.readmeCrawl("hyukji","AlgorithmProblem",1253));
    }

    public static String readmeCrawl(String nickname,String repo,int pbNum){
        String url = "https://raw.githubusercontent.com/name/repo/main/%EB%B0%B1%EC%A4%80/tier/number/README.md";
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
        url = url.replace("name",nickname)
                .replace("repo",repo)
                .replace("tier",tierCheck)
                .replace("number",temp.getNumber()+".%20"+temp.getName());
        return getReadmeContent(url);
    }

    public static String getReadmeContent(String url) {
//        Document sdoc = null;
        Document doc = null;
        try {
            System.out.println(url.replace("%20","%E2%80%85").replace(" ","%E2%80%85").replace("-","%EF%BC%8D"));
            //sdoc = Jsoup.parse(new URL(url.replace("%20","%E2%80%85").replace(" ","%E2%80%85").replace("-","%EF%BC%8D")).openStream(), "UTF-8", url.replace("%20","%E2%80%85").replace(" ","%E2%80%85").replace("-","%EF%BC%8D"));
            doc = Jsoup.connect(url.replace("%20","%E2%80%85").replace(" ","%E2%80%85").replace("-","%EF%BC%8D"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Accept-Encoding", "gzip, deflate, br")
                    .header("Accept-Language", "ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4")
                    .get();
            Element body = doc.body();

            if (body == null) {
                return "";
            }
            return body.toString();

        } catch (IOException e) {
            System.out.println(e.getMessage());
            return null;
        }

    }
}
