package S11P12A708.A708.common.error.exception;
import S11P12A708.A708.common.error.ErrorCode;

public class UserNotFindException extends BusinessException {

    public UserNotFindException() {
        super(ErrorCode.USER_NOT_FOUND);
    }

}