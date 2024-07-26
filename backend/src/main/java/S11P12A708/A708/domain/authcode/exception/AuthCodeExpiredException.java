package S11P12A708.A708.domain.authcode.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class AuthCodeExpiredException extends BusinessException {
    public AuthCodeExpiredException() {
        super(ErrorCode.AUTH_CODE_EXPIRED);
    }
}
