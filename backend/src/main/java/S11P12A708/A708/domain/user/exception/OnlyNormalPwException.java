package S11P12A708.A708.domain.user.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class OnlyNormalPwException extends BusinessException {
    public OnlyNormalPwException() {
        super(ErrorCode.ONLY_NORMAL_PW);
    }
}

