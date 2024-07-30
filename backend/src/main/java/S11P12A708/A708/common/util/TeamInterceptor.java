package S11P12A708.A708.common.util;

import S11P12A708.A708.domain.team.entity.TeamUser;
import S11P12A708.A708.domain.team.exception.UserNotTeamException;
import S11P12A708.A708.domain.team.repository.query.TeamQueryRepository;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;

@RequiredArgsConstructor
@Component
public class TeamInterceptor implements HandlerInterceptor {

    private final TeamQueryRepository teamQueryRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final User user = (User) authentication.getPrincipal();

        final Map<?, ?> pathVariables = (Map<?, ?>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        final Long teamId = Long.parseLong((String)pathVariables.get("teamId"));

        // 로그인 유저가 팀에 소속되어 있는 지
        final TeamUser loginTeamUser = teamQueryRepository.findTeamUserByIds(teamId, user.getId());
        if(loginTeamUser == null) throw new UserNotTeamException();

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

}
