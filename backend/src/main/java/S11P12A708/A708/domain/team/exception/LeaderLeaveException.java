package S11P12A708.A708.domain.team.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class LeaderLeaveException extends BusinessException {

    public LeaderLeaveException() {
        super(ErrorCode.LEADER_LEAVE_EXCEPTION);
    }

}