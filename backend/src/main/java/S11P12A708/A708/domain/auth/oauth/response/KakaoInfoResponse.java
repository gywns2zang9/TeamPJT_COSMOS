package S11P12A708.A708.domain.auth.oauth.response;

import S11P12A708.A708.domain.user.entity.UserType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoInfoResponse implements OAuthInfoResponse {
    // https://kapi.kakao.com/v2/user/me 요청 결과값

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class KakaoAccount {
        private String email;
    }

    @Override
    public String getEmail() {
        return kakaoAccount.email;
    }

    @Override
    public UserType userType() {
        return UserType.KAKAO;
    }
}