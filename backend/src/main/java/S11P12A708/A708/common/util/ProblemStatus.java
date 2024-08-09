package S11P12A708.A708.common.util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ProblemStatus {
    private static final String BOJ_Profile_URL = "https://www.acmicpc.net/user/";

    public static boolean check(String name,int number){
        String url = new StringBuilder().append(BOJ_Profile_URL).append(name).toString();
        return getStatus(url,number);
    }

    public static boolean getStatus(String url,int number) {
        Document doc = null; // URL을 실제 URL로 대체하세요.
        try {
            doc = Jsoup.connect(url.replace("%20","%E2%80%85").replace(" ","%E2%80%85").replace("-","%EF%BC%8D")).get();
            Elements problemListDivs = doc.getElementsByClass("problem-list");
            String StringNumber = Integer.toString(number);
            for (Element div : problemListDivs) {
                String[] arr = div.text().split(" ");
                for(String sen : arr){
                    if(sen.equals(StringNumber))return true;
                }
                return false;
            }
        } catch (IOException e) {
            e.getMessage();
            return false;
        }


        return false;
    }

}
