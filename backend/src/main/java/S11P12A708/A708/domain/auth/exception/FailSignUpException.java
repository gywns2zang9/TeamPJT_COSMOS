package S11P12A708.A708.domain.auth.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class FailSignUpException extends BusinessException {
    public FailSignUpException() {
        super(ErrorCode.FAIL_SING_UP);
    }
}
