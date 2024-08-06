package S11P12A708.A708.domain.study.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class StudyNotBelongToTeamException extends BusinessException {

    public StudyNotBelongToTeamException() {
        super(ErrorCode.STUDY_NOT_BELONG_TO_TEAM);
    }

}