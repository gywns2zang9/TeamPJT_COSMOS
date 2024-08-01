package S11P12A708.A708.domain.team.service;

import S11P12A708.A708.domain.authcode.exception.FailMailException;
import S11P12A708.A708.domain.team.exception.TeamAlreadyJoinException;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.team.repository.TeamUserRepository;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.team.request.InviteTeamRequest;
import S11P12A708.A708.domain.team.request.TeamInfoRequest;
import S11P12A708.A708.domain.team.request.TeamJoinRequest;
import S11P12A708.A708.domain.team.response.TeamCodeResponse;
import S11P12A708.A708.domain.team.response.TeamIdResponse;
import S11P12A708.A708.domain.team.response.TeamResponse;
import S11P12A708.A708.domain.team.service.TeamCodeGenerator.TeamCodeGenerator;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;

import static S11P12A708.A708.domain.team.entity.TeamUserRole.LEADER;
import static S11P12A708.A708.domain.team.entity.TeamUserRole.MEMBER;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TeamAuthService {
    @Value("${spring.mail.username}")
    private String from;

    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;
    private final UserRepository userRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final TeamCodeGenerator generator;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public List<TeamResponse> getTeamsByUserId(Long userId) throws RuntimeException {
        final List<Team> teams = teamQueryRepository.findTeamsByUserId(userId).orElse(List.of());
        return teams.stream().map(TeamResponse::of).toList();
     }

    public TeamIdResponse createTeam(Long userId, TeamInfoRequest request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.save(requestToEntity(request));
        teamUserRepository.save(new TeamUser(user, team, LEADER));
        return TeamIdResponse.of(team);
    }

    public TeamCodeResponse getTeamCode(Long teamId) {
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        String teamCode = team.getTeamCode();
        if(teamCode == null) {
            teamCode = team.setTeamCode(generator);
            teamRepository.save(team);
        }

        return new TeamCodeResponse(teamCode);
    }

    public void joinTeam(Long userId, TeamJoinRequest request) {
        final User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        final Team team = teamRepository.findByTeamCode(request.getTeamCode()).orElseThrow(TeamNotFoundException::new);
        final TeamUser teamUser = teamUserRepository.findByTeamAndUser(team, user);
        if(teamUser != null) throw new TeamAlreadyJoinException();

        teamUserRepository.save(new TeamUser(user, team, MEMBER));
    }

    private Team requestToEntity(TeamInfoRequest request) {
        return new Team(
                request.getGroupName(),
                request.getDescription()
        );
    }

    public void sendInviteEmail(Long teamId, InviteTeamRequest req) {
        try {
            String teamCode = getTeamCode(teamId).getTeamCode();

            if (req.getEmails().length != 0) {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(from);
                helper.setTo(req.getEmails());
                helper.setSubject("[COSMOS] 초대 메일");

                Context context = new Context();
                context.setVariable("code", teamCode);

                String text = templateEngine.process("mail/InviteMail", context);
                helper.setText(text, true);

                mailSender.send(message);
            }
        } catch (Exception e) {
            throw new FailMailException();
        }
    }
}
