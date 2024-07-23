package S11P12A708.A708.common.error;

import S11P12A708.A708.common.error.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingRequestValueException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import static S11P12A708.A708.common.error.ErrorCode.INTERNAL_SERVER;
import static S11P12A708.A708.common.error.ErrorCode.REQUEST_INVALID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(e);
        return new ResponseEntity<>(errorResponse, e.getHttpStatus());
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        final ErrorResponse errorResponse = ErrorResponse.of(INTERNAL_SERVER);
        return new ResponseEntity<>(errorResponse, INTERNAL_SERVER.getCode());
    }


    @ExceptionHandler({
            MissingServletRequestPartException.class,
            MissingRequestValueException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class,
            HttpRequestMethodNotSupportedException.class
    })
    public ResponseEntity<ErrorResponse> handleRequestException(Exception e) {
        final ErrorResponse errorResponse = ErrorResponse.of(REQUEST_INVALID);
        return new ResponseEntity<>(errorResponse, REQUEST_INVALID.getCode());
    }

}
