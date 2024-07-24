package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND);
    }
}
