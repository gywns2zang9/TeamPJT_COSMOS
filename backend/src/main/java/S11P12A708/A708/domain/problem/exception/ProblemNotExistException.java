package S11P12A708.A708.domain.problem.exception;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.BusinessException;

public class ProblemNotExistException extends BusinessException {
    public ProblemNotExistException() {
        super(ErrorCode.PROBLEM_NOT_EXIST);
    }
}
