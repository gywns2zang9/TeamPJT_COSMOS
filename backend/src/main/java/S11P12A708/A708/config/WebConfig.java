package S11P12A708.A708.config;

import S11P12A708.A708.common.util.TeamInterceptor;
import S11P12A708.A708.domain.auth.annotation.AuthArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthArgumentResolver authArgumentResolver;
    private final TeamInterceptor teamInterceptor;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(teamInterceptor)
                .addPathPatterns("/teams/**") /* 인터셉터가 실행될 url 패턴 */
//                .excludePathPatterns("/teams/auth") /* 인터셉터가 실행되지 않을 url 패턴 */
        ;
    }
}