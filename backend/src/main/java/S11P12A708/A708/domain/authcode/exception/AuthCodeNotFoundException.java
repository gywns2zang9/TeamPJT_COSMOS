package S11P12A708.A708.domain.authcode.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class AuthCodeNotFoundException extends BusinessException {
    public AuthCodeNotFoundException() {
        super(ErrorCode.AUTH_CODE_NOT_FOUND);
    }
}
