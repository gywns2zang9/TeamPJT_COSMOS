package S11P12A708.A708.domain.file.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class InvalidDeleteFileException extends BusinessException {

    public InvalidDeleteFileException() {
        super(ErrorCode.INVALID_DELETE_FILE);
    }

}