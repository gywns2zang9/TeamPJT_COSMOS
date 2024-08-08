package S11P12A708.A708.domain.code.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class CodeNotExistException extends BusinessException {
    public CodeNotExistException() {
        super(ErrorCode.CODE_NOT_EXIST);
    }
}
