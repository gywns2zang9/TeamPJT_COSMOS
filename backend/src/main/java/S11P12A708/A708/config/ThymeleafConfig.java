package S11P12A708.A708.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@Configuration
public class ThymeleafConfig {

    @Bean(name = "customTemplateEngine")
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        return templateEngine;
    }

    @Bean
    public ITemplateResolver templateResolver() {
        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
        templateResolver.setPrefix("classpath:/templates/"); // 템플릿 위치
        templateResolver.setSuffix(".html"); // 템플릿 파일 확장자
        templateResolver.setTemplateMode("HTML"); // 템플릿 모드 설정 (HTML, XML 등)
        templateResolver.setCharacterEncoding("UTF-8"); // 문자 인코딩
        templateResolver.setCacheable(false); // 템플릿 캐싱 여부
        return templateResolver;
    }
}
