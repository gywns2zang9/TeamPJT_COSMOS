package S11P12A708.A708.domain.folder.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class FolderNotFoundException extends BusinessException {

    public FolderNotFoundException() {
        super(ErrorCode.FOLDER_NOT_FOUND);
    }

}