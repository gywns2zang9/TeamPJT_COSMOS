package S11P12A708.A708.domain.auth.oauth.response;

import S11P12A708.A708.domain.user.entity.UserType;

public interface OAuthInfoResponse {
    String getEmail();
    UserType userType();
}
