package S11P12A708.A708.domain.study.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class StudyNotFoundException extends BusinessException {

    public StudyNotFoundException() {
        super(ErrorCode.STUDY_NOT_FOUND);
    }

}