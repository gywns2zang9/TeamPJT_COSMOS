package S11P12A708.A708.domain.auth.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class AuthNecessaryException extends BusinessException {
    public AuthNecessaryException() {
        super(ErrorCode.AUTH_NECESSARY);
    }
}
