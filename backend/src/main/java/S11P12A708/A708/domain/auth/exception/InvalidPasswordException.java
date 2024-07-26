package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class InvalidPasswordException extends BusinessException {
    public InvalidPasswordException() {
        super(ErrorCode.INVALID_PASSWORD);
    }
}
