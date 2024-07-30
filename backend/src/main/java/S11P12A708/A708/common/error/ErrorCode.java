package S11P12A708.A708.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@Getter
public enum ErrorCode {

    // Global
    REQUEST_INVALID(UNPROCESSABLE_ENTITY, "request", "invalid."),
    INTERNAL_SERVER(UNPROCESSABLE_ENTITY, "internal", "server error."),

    // User
    USER_NOT_FOUND(UNPROCESSABLE_ENTITY, "user", "user not found."),
    USER_INVALID(UNPROCESSABLE_ENTITY, "user", "incorrect user request error"),
    INVALID_PASSWORD(UNPROCESSABLE_ENTITY, "user", "incorrect password"),

    // Team
    TEAM_NOT_FOUND(UNPROCESSABLE_ENTITY, "Team", "This Team is not exist"),
    LEADER_LEAVE_EXCEPTION(UNPROCESSABLE_ENTITY, "Leader", "Team Leader cannot leave team"),
    LEADER_NOT(UNPROCESSABLE_ENTITY, "Leader", "user is not leader"),
    USER_NOT_TEAM(UNPROCESSABLE_ENTITY, "Team", "this user does not have permission of this team");


    private final HttpStatus code;
    private final String body;
    private final String message;

    ErrorCode(HttpStatus code, String body, String message) {
        this.code = code;
        this.body = body;
        this.message = message;
    }

}