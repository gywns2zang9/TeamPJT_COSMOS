package S11P12A708.A708.common.error.exception;
import S11P12A708.A708.common.error.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public HttpStatus getHttpStatus() {
        return errorCode.getCode();
    }

    public String getBody() {
        return errorCode.getBody();
    }

    @Override
    public String getMessage() {
        return errorCode.getMessage();
    }

}