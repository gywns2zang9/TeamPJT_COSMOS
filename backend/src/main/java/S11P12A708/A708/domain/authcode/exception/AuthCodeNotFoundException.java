package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class AuthCodeNotFoundException extends BusinessException {
    public AuthCodeNotFoundException() {
        super(ErrorCode.AUTH_CODE_NOT_FOUND);
    }
}
