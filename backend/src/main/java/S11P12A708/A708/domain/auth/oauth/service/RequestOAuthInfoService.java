package S11P12A708.A708.domain.auth.oauth.service;

import S11P12A708.A708.domain.auth.oauth.client.OAuthApiClient;
import S11P12A708.A708.domain.auth.oauth.request.OAuthLoginParams;
import S11P12A708.A708.domain.auth.oauth.response.OAuthInfoResponse;
import S11P12A708.A708.domain.user.entity.UserType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class RequestOAuthInfoService {
    private final Map<UserType, OAuthApiClient> clients;

    public RequestOAuthInfoService(List<OAuthApiClient> clients) {
        this.clients = clients.stream().collect(
                Collectors.toUnmodifiableMap(OAuthApiClient::oAuthProvider, Function.identity())
        );
    }

    public OAuthInfoResponse request(OAuthLoginParams params) {
        OAuthApiClient client = clients.get(params.userType());
        String accessToken = client.requestAccessToken(params);
        return client.requestOauthInfo(accessToken);
    }
}