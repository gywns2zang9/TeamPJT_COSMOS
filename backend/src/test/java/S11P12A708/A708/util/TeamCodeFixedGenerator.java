package S11P12A708.A708.util;

import S11P12A708.A708.domain.team.service.TeamCodeGenerator.TeamCodeGenerator;
import org.springframework.stereotype.Component;

@Component
public class TeamCodeFixedGenerator implements TeamCodeGenerator {

    @Override
    public String generate(Long teamId) {
        final String suffix = "000000";
        return teamId + suffix;
    }

}
