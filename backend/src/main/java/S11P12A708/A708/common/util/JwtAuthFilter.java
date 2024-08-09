package S11P12A708.A708.common.util;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.ErrorResponse;
import S11P12A708.A708.common.error.exception.JwtAuthenticationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

// HTTP 요청에서 JWT access 토큰을 추출하고 인증하는 필터
@Slf4j
@Component
public class JwtAuthFilter implements Filter {

    private final static String refreshUrl = "/api/auth/refresh";
    private final static String userUrl = "users";

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public JwtAuthFilter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository, ObjectMapper objectMapper) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String path = httpRequest.getRequestURI();

        try {
            String token = getJwtFromRequest(httpRequest);
            boolean access = !path.equals(refreshUrl);
            if (token != null && jwtTokenUtil.validateToken(token, access)) {
                String tokenUserId = jwtTokenUtil.getUserIdFromToken(token);
                String urlUserId = extractUserIdFromUrl(path);

                if (urlUserId != null && !tokenUserId.equals(urlUserId)) {
                    sendErrorResponse(httpResponse, ErrorCode.INVALID_ACCESS);
                    return;
                }

                Optional<User> user = userRepository.findById(Long.parseLong(tokenUserId));
                if (user.isEmpty()) sendErrorResponse(httpResponse, ErrorCode.USER_NOT_FOUND);

                Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (JwtAuthenticationException e) {
            sendErrorResponse(httpResponse, e.getErrorCode());
            return;
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
            if (userUrl.equals(pathSegments[i]) && i + 1 < pathSegments.length) {
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
            Long.parseLong(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private void sendErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ErrorResponse errorResponse = ErrorResponse.of(errorCode);

        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(jsonResponse);
    }
}