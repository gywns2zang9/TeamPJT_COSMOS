package S11P12A708.A708.domain.code.entity;

public enum Language {

    PYTHON("python"),
    CPP("cpp"),
    JAVA("java")
    ;

    private final String label;

    Language(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
