package S11P12A708.A708.common.util.executor;

import java.io.*;

public interface CodeExecutor {

    int timeLimit = 5;
    String hostPath = "/tmp";
    String imagePrefix = "a708_1_";

    String compileErrorMessage = "Compilation failed";
    String executeTimeLimit = "Execution timed out after " + timeLimit + " seconds";

    String executeCode(String code, String input);

    File createCodeFile(String code, String hostPath) throws IOException;

    default String readProcessOutput(InputStream inputStream) throws IOException {
        try (BufferedReader output = new BufferedReader(new InputStreamReader(inputStream))) {
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = output.readLine()) != null) {
                result.append(line).append("\n");
            }
            return result.toString().trim();
        }
    }

}
