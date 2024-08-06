package S11P12A708.A708.common.util;

import S11P12A708.A708.domain.auth.exception.InvalidAccessException;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String token = getJwtFromRequest(httpRequest);

        if (token != null && jwtTokenUtil.validateToken(token)) {
            String path = httpRequest.getRequestURI();
            String tokenUserId = jwtTokenUtil.getUserIdFromToken(token);
            String urlUserId = extractUserIdFromUrl(path);

            if (urlUserId != null && !tokenUserId.equals(urlUserId)) throw new InvalidAccessException();
            User user = userRepository.findById(Long.parseLong(tokenUserId)).orElseThrow(UserNotFoundException::new);

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

    private String extractUserIdFromUrl(String path) {
        String[] pathSegments = path.split("/");

        for (int i = 0; i < pathSegments.length; i++) {
            if ("users".equals(pathSegments[i]) && i + 1 < pathSegments.length) {
                String potentialUserId = pathSegments[i + 1];
                if (isNumeric(potentialUserId)) {
                    return potentialUserId;
                }
            }
        }
        return null;
    }

    private boolean isNumeric(String str) {
        try {
            Long.parseLong(str); // long 타입으로 변환해볼 수 있음
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}