package S11P12A708.A708.common.util;

import S11P12A708.A708.common.error.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.service.UserService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

// HTTP 요청에서 JWT access 토큰을 추출하고 인증하는 필터
@Slf4j
@Component
public class JwtAuthFilter implements Filter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    public JwtAuthFilter(JwtTokenUtil jwtTokenUtil, UserService userService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();
        if (path.startsWith("/auth/signup") || path.startsWith("/auth/login")) {
            chain.doFilter(request, response);
            return;
        }

        String token = getJwtFromRequest(httpRequest);

        if (token != null && jwtTokenUtil.validateToken(token)) {
            String email = jwtTokenUtil.getEmailFromToken(token);
            User user = userService.getUserByEmail(email).orElseThrow(UserNotFoundException::new);
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}