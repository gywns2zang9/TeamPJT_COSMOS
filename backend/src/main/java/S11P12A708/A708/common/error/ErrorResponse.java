package S11P12A708.A708.common.error;

import S11P12A708.A708.common.error.exception.BusinessException;
import lombok.Getter;

import java.util.HashMap;

@Getter
public class ErrorResponse  {

    private final HashMap<String, String> error;

    private ErrorResponse(HashMap<String, String> error) {
        this.error = error;
    }

    public static ErrorResponse of(BusinessException e) {
        final HashMap<String, String> errors = new HashMap<>();
        errors.put(e.getBody(), e.getMessage());
        return new ErrorResponse(errors);
    }

    public static ErrorResponse of(ErrorCode e) {
        final HashMap<String, String> errors = new HashMap<>();
        errors.put(e.getBody(), e.getMessage());
        return new ErrorResponse(errors);
    }

    public static ErrorResponse from(String error, String Message) {
        final HashMap<String, String> errors = new HashMap<>();
        errors.put(error, Message);
        return new ErrorResponse(errors);
    }

}
