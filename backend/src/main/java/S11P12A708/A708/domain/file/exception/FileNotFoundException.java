package S11P12A708.A708.domain.file.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class FileNotFoundException extends BusinessException {

    public FileNotFoundException() {
        super(ErrorCode.FILE_NOT_FOUND);
    }

}