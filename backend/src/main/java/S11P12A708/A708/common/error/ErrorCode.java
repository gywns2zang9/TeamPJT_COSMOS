package S11P12A708.A708.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Global
    REQUEST_INVALID(HttpStatus.UNPROCESSABLE_ENTITY, "request", "invalid."),
    INTERNAL_SERVER(HttpStatus.UNPROCESSABLE_ENTITY, "internal", "server error."),

    // Team
    USER_NOT_FOUND(HttpStatus.UNPROCESSABLE_ENTITY, "UserNotFound", "The specified user does not exist.");

    private final HttpStatus code;
    private final String body;
    private final String message;

    ErrorCode(HttpStatus code, String body, String message) {
        this.code = code;
        this.body = body;
        this.message = message;
    }

}