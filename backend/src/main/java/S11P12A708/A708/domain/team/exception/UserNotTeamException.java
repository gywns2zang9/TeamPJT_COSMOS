package S11P12A708.A708.domain.team.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class UserNotTeamException extends BusinessException {

    public UserNotTeamException() {
        super(ErrorCode.USER_NOT_TEAM);
    }

}