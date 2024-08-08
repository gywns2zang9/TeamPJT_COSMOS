package S11P12A708.A708.domain.code.entity;

import S11P12A708.A708.common.util.executor.CodeExecutor;
import S11P12A708.A708.common.util.executor.JavaCodeExecutor;
import S11P12A708.A708.common.util.executor.PythonCodeExecutor;
import lombok.Getter;

@Getter
public enum Language {

    JAVA(".java", new JavaCodeExecutor()),
    PYTHON(".py", new PythonCodeExecutor());

    private final String extension;
    private final CodeExecutor executor;

    Language(String extension, CodeExecutor executor) {
        this.extension = extension;
        this.executor = executor;
    }

    public String executeCode(String code, String input) {
        return executor.executeCode(code, input);
    }

}
