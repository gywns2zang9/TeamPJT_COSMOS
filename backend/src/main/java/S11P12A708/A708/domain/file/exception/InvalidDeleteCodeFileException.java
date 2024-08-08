package S11P12A708.A708.domain.file.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class InvalidDeleteCodeFileException extends BusinessException {

    public InvalidDeleteCodeFileException() {
        super(ErrorCode.INVALID_DELETE_CODE_FILE);
    }

}