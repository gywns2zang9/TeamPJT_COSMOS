package S11P12A708.A708.domain.team.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class TeamAlreadyJoinException extends BusinessException {

    public TeamAlreadyJoinException() {
        super(ErrorCode.TEAM_ALREADY_JOIN);
    }

}