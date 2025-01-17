package S11P12A708.A708.domain.authcode.service;

import S11P12A708.A708.domain.auth.exception.AuthNecessaryException;
import S11P12A708.A708.domain.auth.exception.InvalidPasswordException;
import S11P12A708.A708.domain.auth.service.AuthService;
import S11P12A708.A708.domain.authcode.exception.AuthCodeExpiredException;
import S11P12A708.A708.domain.authcode.exception.AuthCodeNotFoundException;
import S11P12A708.A708.domain.authcode.exception.FailMailException;
import S11P12A708.A708.domain.authcode.exception.InvalidAuthCodeException;
import S11P12A708.A708.domain.authcode.request.FindPwRequest;
import S11P12A708.A708.domain.authcode.request.VerifyAuthCodeRequest;
import S11P12A708.A708.domain.user.entity.UserType;
import S11P12A708.A708.domain.user.exception.OnlyNormalPwException;
import S11P12A708.A708.domain.user.exception.UserAlreadyExistException;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import S11P12A708.A708.domain.authcode.entity.AuthType;
import S11P12A708.A708.domain.authcode.entity.Authcode;
import S11P12A708.A708.domain.authcode.repository.AuthCodeRepository;
import S11P12A708.A708.domain.authcode.repository.query.AuthCodeQueryRepository;
import S11P12A708.A708.domain.authcode.response.SendEmailResponse;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class AuthCodeService {
    @Value("${spring.mail.username}")
    private String from;

    @Value("${app.expired-time}")
    private int expiredTime;

    private final AuthCodeRepository authCodeRepository;
    private final AuthCodeQueryRepository authCodeQueryRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final PasswordEncoder bCryptPasswordEncoder;

    public AuthCodeService(AuthCodeRepository authCodeRepository,
                           AuthCodeQueryRepository authCodeQueryRepository,
                           UserRepository userRepository,
                           AuthService authService,
                           JavaMailSender mailSender,
                           @Qualifier("customTemplateEngine") TemplateEngine templateEngine,
                           PasswordEncoder bCryptPasswordEncoder) {
        this.authCodeRepository = authCodeRepository;
        this.authCodeQueryRepository = authCodeQueryRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public SendEmailResponse generateAuthCode(String email, AuthType type) throws RuntimeException {
        String code = UUID.randomUUID().toString();

        errIfExistEmailOrNot(email, type);
        Optional<Authcode> foundAuthCode = authCodeRepository.findByEmail(email);

        if (foundAuthCode.isPresent()) {
            Authcode authCode = foundAuthCode.get();
            authCode.setType(type);
            authCode.setAuthToken(code);
            authCodeRepository.save(authCode);
        } else {
            Authcode newAuthCode = new Authcode(email, type, code, LocalDateTime.now());
            authCodeRepository.save(newAuthCode);
        }

        sendAuthMail(type, email, code);
        return new SendEmailResponse(expiredTime);
    }

    private void errIfExistEmailOrNot(String email, AuthType type) {
        Optional<User> foundEmailUser = userRepository.findByEmail(email);

        if (type == AuthType.SIGN_UP && foundEmailUser.isPresent()) {
            throw new UserAlreadyExistException();
        } else if (type == AuthType.FIND_PW) {
            if (foundEmailUser.isEmpty()) throw new UserNotFoundException();
            else if (foundEmailUser.get().getType() != UserType.NORMAL) throw new OnlyNormalPwException();
        }
    }

    private void sendAuthMail(AuthType type, String email, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(email);

            String subject = "";
            if (type == AuthType.SIGN_UP) {
                subject = "[COSMOS] 회원가입 인증 메일";
            } else if (type == AuthType.FIND_PW) {
                subject = "[COSMOS] 비밀번호 변경 인증 메일";
            }
            helper.setSubject(subject);

            Context context = new Context();
            context.setVariable("type", type);
            context.setVariable("code", code);
            context.setVariable("expiredAt", expiredTime);

            String text = templateEngine.process("mail/AuthMail", context);
            helper.setText(text, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new FailMailException();
        }
    }

    public boolean verifyAuthCode(VerifyAuthCodeRequest req, AuthType type) {
        Optional<Authcode> foundAuthCodeOpt = authCodeQueryRepository.findByEmailAndType(req.getEmail(), type);
        if (foundAuthCodeOpt.isEmpty()) throw new AuthCodeNotFoundException();

        Authcode foundAuthCode = foundAuthCodeOpt.get();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime createdAt = foundAuthCode.getUpdatedAt();
        long diffMinute = ChronoUnit.MINUTES.between(createdAt, now);

        if (diffMinute > expiredTime) {
            authCodeRepository.deleteById(foundAuthCode.getId());
            throw new AuthCodeExpiredException();
        } else if (!foundAuthCode.getAuthToken().equals(req.getAuthCode())) {
            throw new InvalidAuthCodeException();
        }

        approveAuthCode(foundAuthCode, type);
        return true;
    }

    private void approveAuthCode(Authcode authcode, AuthType type) {
        if (type == AuthType.FIND_PW) {
            authcode.setType(AuthType.FIND_PW_ABLE);
            authcode.setAuthToken(null);
            authCodeRepository.save(authcode);
        } else if (type == AuthType.SIGN_UP) {
            authcode.setType(AuthType.SIGN_UP_ABLE);
            authcode.setAuthToken(null);
            authCodeRepository.save(authcode);
        }
    }

    @Transactional
    public boolean changePassword(FindPwRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(UserNotFoundException::new);
        if (user.getType() != UserType.NORMAL) throw new OnlyNormalPwException();

        if (errIfNotVerifyEmail(req.getEmail()) && authService.pwCheck(req.getNewPassword())) {
            user.setPassword(req.getNewPassword());
            user.hashPassword(bCryptPasswordEncoder);

            authCodeRepository.deleteByEmail(req.getEmail());
            userRepository.save(user);

            return true;
        }

        throw new InvalidPasswordException();
    }

    private boolean errIfNotVerifyEmail(String email) throws AuthNecessaryException {
        Optional<Authcode> foundAuthCodeUser = authCodeRepository.findByEmail(email);

        if (foundAuthCodeUser.isPresent()) {
            Authcode authcode = foundAuthCodeUser.get();

            if (authcode.getType() == AuthType.FIND_PW) {
                throw new AuthNecessaryException();
            } else return authcode.getType() == AuthType.FIND_PW_ABLE;
        }
        throw new AuthNecessaryException();
    }

}
