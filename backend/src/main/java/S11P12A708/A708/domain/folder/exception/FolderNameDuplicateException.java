package S11P12A708.A708.domain.folder.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class FolderNameDuplicateException extends BusinessException {

    public FolderNameDuplicateException() {
        super(ErrorCode.FOLDER_NAME_DUPLICATE);
    }

}