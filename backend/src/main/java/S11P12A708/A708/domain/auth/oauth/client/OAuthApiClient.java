package S11P12A708.A708.domain.auth.oauth.client;

import S11P12A708.A708.domain.auth.oauth.request.OAuthLoginParams;
import S11P12A708.A708.domain.auth.oauth.response.OAuthInfoResponse;
import S11P12A708.A708.domain.user.entity.UserType;

public interface OAuthApiClient {
    UserType oAuthProvider();
    String requestAccessToken(OAuthLoginParams params);
    OAuthInfoResponse requestOauthInfo(String accessToken);
}