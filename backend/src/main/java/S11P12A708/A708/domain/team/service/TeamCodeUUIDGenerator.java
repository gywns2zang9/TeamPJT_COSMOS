package S11P12A708.A708.domain.team.service;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TeamCodeUUIDGenerator implements TeamCodeGenerator{

    @Override
    public String generate(Long teamId) {
        final String suffix = UUID.randomUUID().toString().substring(0, 6);
        return teamId + suffix;
    }

}
