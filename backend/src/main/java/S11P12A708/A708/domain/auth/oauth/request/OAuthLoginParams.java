package S11P12A708.A708.domain.auth.oauth.request;

import S11P12A708.A708.domain.user.entity.UserType;
import org.springframework.util.MultiValueMap;

public interface OAuthLoginParams {
    UserType userType();
    MultiValueMap<String, String> makeBody();
}
