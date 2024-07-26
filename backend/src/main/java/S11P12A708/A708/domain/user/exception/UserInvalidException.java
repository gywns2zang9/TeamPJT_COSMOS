package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class UserInvalidException extends BusinessException {
    public UserInvalidException() {
        super(ErrorCode.USER_INVALID);
    }
}
