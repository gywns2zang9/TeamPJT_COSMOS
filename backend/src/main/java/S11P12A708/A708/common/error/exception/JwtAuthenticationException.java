package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class JwtAuthenticationException extends BusinessException {
    public JwtAuthenticationException(ErrorCode errorCode) {
        super(errorCode);
    }
}
