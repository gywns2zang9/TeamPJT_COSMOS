package S11P12A708.A708.domain.auth.oauth.response;

import S11P12A708.A708.domain.user.entity.UserType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverInfoResponse implements OAuthInfoResponse {

    @JsonProperty("response")
    private Response response;

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Response {
        private String email;
    }

    @Override
    public String getEmail() {
        return response.email;
    }

    @Override
    public UserType userType() {
        return UserType.NAVER;
    }
}