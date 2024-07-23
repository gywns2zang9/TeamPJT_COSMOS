package S11P12A708.A708.common.error.exception;
import S11P12A708.A708.common.error.ErrorCode;

public class TeamNotFoundException extends BusinessException {

    public TeamNotFoundException() {
        super(ErrorCode.TEAM_NOT_FOUND);
    }

}