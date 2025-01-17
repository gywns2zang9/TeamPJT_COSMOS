package S11P12A708.A708.common.util;

import S11P12A708.A708.common.error.ErrorCode;
import S11P12A708.A708.common.error.exception.JwtAuthenticationException;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class JwtTokenUtil {
    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.access.expiration}")
    private long accessTokenExpirationTime; // 1시간

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpirationTime; // 7일

    public JwtTokenUtil() {}

    public String createAccessToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpirationTime);

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String createRefreshToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationTime);

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token, boolean access) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            if (access) throw new JwtAuthenticationException(ErrorCode.ACCESS_TOKEN_EXPIRED);
            else throw new JwtAuthenticationException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        } catch (Exception e) {
            if (access) throw new JwtAuthenticationException(ErrorCode.ACCESS_TOKEN_UNEXPECTED);
            else throw new JwtAuthenticationException(ErrorCode.REFRESH_TOKEN_UNEXPECTED);
        }
    }
}