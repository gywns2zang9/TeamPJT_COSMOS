package S11P12A708.A708.domain.code.entity;

import lombok.Getter;

@Getter
public enum Language {

    JAVA(".java"), PYTHON(".py"), CPP(".cc");

    private final String extension;

    Language(String extension) {
        this.extension = extension;
    }

}
