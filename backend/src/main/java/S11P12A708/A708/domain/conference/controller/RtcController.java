package S11P12A708.A708.domain.conference.controller;

import S11P12A708.A708.domain.auth.annotation.AuthUser;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class RtcController {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private final static String customSessionId = "customSessionId";

    private final Map<Long, String> userConnections = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @return The Session ID
     */
    @PostMapping("/sessions/teams/{teamId}")
    public ResponseEntity<String> initializeSession(@PathVariable("teamId") String teamId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = createSession(teamId);
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/sessions/teams/{teamId}/connections")
    public ResponseEntity<String> createConnection(@AuthUser AuthUserDto authUser,
                                                   @PathVariable("teamId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws Exception {

        // 이전에 해당 유저가 접근한 커넥션이 열려있다면 닫는다.
        if (userConnections.containsKey(authUser.getId())) {
            removeConnection(authUser, sessionId);
        }

        Session session = createSession(sessionId);

        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        userConnections.put(authUser.getId(), connection.getConnectionId());

        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    private Session createSession(String teamId) throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String, Object> params = Map.of(customSessionId, teamId);
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        return session;
    }

    private void removeConnection(AuthUserDto authUser, String sessionId) throws Exception {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) throw new Exception("session 업음");

        List<Connection> activeConnections = session.getActiveConnections();
        for (Connection connection : activeConnections) {
            if (connection.getConnectionId().equals(userConnections.get(authUser.getId()))) {
                session.forceDisconnect(connection); // 세션에 입장한 사용자 연결 끊기
            }
        }
    }

}
