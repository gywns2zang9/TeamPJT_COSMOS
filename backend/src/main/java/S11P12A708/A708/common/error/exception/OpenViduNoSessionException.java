package S11P12A708.A708.common.error.exception;

import S11P12A708.A708.common.error.ErrorCode;

public class OpenViduNoSessionException extends BusinessException {
    public OpenViduNoSessionException() {
        super(ErrorCode.OPENVIDU_NO_SESSION);
    }
}
