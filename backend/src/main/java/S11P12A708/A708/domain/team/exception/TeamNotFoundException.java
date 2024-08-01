package S11P12A708.A708.domain.team.exception;
import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class TeamNotFoundException extends BusinessException {

    public TeamNotFoundException() {
        super(ErrorCode.TEAM_NOT_FOUND);
    }

}