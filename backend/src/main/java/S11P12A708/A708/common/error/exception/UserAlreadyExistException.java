package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class UserAlreadyExistException extends BusinessException {
    public UserAlreadyExistException() {
        super(ErrorCode.USER_ALREADY_EXIST);
    }
}
