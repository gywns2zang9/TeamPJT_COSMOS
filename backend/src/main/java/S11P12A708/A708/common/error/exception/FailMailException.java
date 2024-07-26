package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class FailMailException extends BusinessException {
    public FailMailException() {
        super(ErrorCode.FAIL_MAIL);
    }
}
