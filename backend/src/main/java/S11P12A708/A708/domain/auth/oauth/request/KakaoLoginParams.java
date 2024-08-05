package S11P12A708.A708.domain.auth.oauth.request;

import S11P12A708.A708.domain.user.entity.UserType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoLoginParams implements OAuthLoginParams {
    // 카카오 API 요청에 필요한 authorizationCode 를 갖고 있는 클래스
    private String authorizationCode;

    @Override
    public UserType userType() {
        return UserType.KAKAO;
    }

    @Override
    public MultiValueMap<String, String> makeBody() {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", authorizationCode);
        return body;
    }
}