package S11P12A708.A708.domain.auth.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class InvalidNickNameException extends BusinessException {
    public InvalidNickNameException() {
        super(ErrorCode.INVALID_NICKNAME);
    }
}
