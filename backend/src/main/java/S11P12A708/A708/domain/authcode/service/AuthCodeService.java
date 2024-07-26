package S11P12A708.A708.domain.authcode.service;

import S11P12A708.A708.common.error.exception.FailMailException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import S11P12A708.A708.common.error.exception.UserAlreadyExistException;
import S11P12A708.A708.common.error.exception.UserInvalidException;
import S11P12A708.A708.common.error.exception.UserNotFoundException;
import S11P12A708.A708.domain.authcode.entity.AuthType;
import S11P12A708.A708.domain.authcode.entity.Authcode;
import S11P12A708.A708.domain.authcode.repository.AuthCodeRepository;
import S11P12A708.A708.domain.authcode.repository.query.AuthCodeQueryRepository;
import S11P12A708.A708.domain.authcode.response.SendEmailResponse;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthCodeService {
    @Value("${spring.mail.username}")
    private String from;

    private final AuthCodeRepository authCodeRepository;
    private final AuthCodeQueryRepository authCodeQueryRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public SendEmailResponse generateAuthCode(String email, AuthType type) throws RuntimeException {
        String code = UUID.randomUUID().toString();
        int expiredAt = 5;

        errIfExistEmailOrNot(email, type);
        Optional<Authcode> foundAuthCode = authCodeQueryRepository.findByEmailAndType(email, type);

        if (foundAuthCode.isPresent()) {
            Authcode authCode = foundAuthCode.get();
            authCode.setAuthToken(code);
            authCodeRepository.save(authCode);
        } else if (type == AuthType.SIGN_UP) {
            Optional<Authcode> existingCode = authCodeQueryRepository.findByEmailAndType(email, AuthType.SIGN_UP_ABLE);

            if (existingCode.isPresent()) {
                throw new UserInvalidException();
            } else {
                Authcode newAuthCode = new Authcode(email, type, code);
                authCodeRepository.save(newAuthCode);
            }
        } else {
            Authcode newAuthCode = new Authcode(email, type, code);
            authCodeRepository.save(newAuthCode);
        }

        sendAuthMail(type, email, code, expiredAt);
        return new SendEmailResponse(expiredAt);
    }

    private void errIfExistEmailOrNot(String email, AuthType type) {
        Optional<User> foundEmailUser = userRepository.findByEmail(email);

        if (type == AuthType.SIGN_UP && foundEmailUser.isPresent()) {
            throw new UserAlreadyExistException();
        } else if (type == AuthType.FIND_PW && foundEmailUser.isEmpty()) {
            throw new UserNotFoundException();
        }
    }

    private void sendAuthMail(AuthType type, String email, String code, int expiredAt) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(email);

            String subject = "";
            String text = "";

            if (type == AuthType.SIGN_UP) {
                subject = "[COSMOS] 회원가입 인증 메일";
                text = String.format(
                        "<p>COSMOS에서 당신을 초대하기 위한 인증 코드를 보냈습니다!</p>" +
                                "<p>아래 인증 코드를 COSMOS 홈페이지에서 입력해주세요.</p>" +
                                "<p><strong>인증 코드: %s</strong></p>" +
                                "<p>인증 코드는 이메일 발송 시점으로부터 %d분 동안 유효합니다.</p>",
                        code, expiredAt
                );
            } else if (type == AuthType.FIND_PW) {
                subject = "[COSMOS] 비밀번호 변경 인증 메일";
                text = String.format(
                        "<p>COSMOS에서 비밀번호 변경을 위한 인증 코드를 보냈습니다!</p>" +
                                "<p>아래 인증 코드를 COSMOS 홈페이지에서 입력해주세요.</p>" +
                                "<p><strong>인증 코드: %s</strong></p>" +
                                "<p>인증 코드는 이메일 발송 시점으로부터 %d분 동안 유효합니다.</p>",
                        code, expiredAt
                );
            }

            helper.setSubject(subject);
            helper.setText(text, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new FailMailException();
        }
    }
}
