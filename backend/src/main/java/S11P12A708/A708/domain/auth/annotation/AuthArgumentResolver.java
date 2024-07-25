package S11P12A708.A708.domain.auth.annotation;

import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Slf4j
@Component
public class AuthArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        final boolean isRegUserAnnotation = parameter.getParameterAnnotation(AuthUser.class) != null;
        final boolean isRegisterDto = parameter.getParameterType().equals(AuthUserDto.class);
        return isRegUserAnnotation && isRegisterDto;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            User user = (User) authentication.getPrincipal();
            return new AuthUserDto(user.getId(), user.getEmail());
        }
        return null;
    }
}