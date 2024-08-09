package S11P12A708.A708.common.util.executor;

import java.io.*;
import java.util.concurrent.*;

import static S11P12A708.A708.domain.code.entity.Language.PYTHON;

public class PythonCodeExecutor implements CodeExecutor {

    final static String imageName = imagePrefix + "my-python-image";

    @Override
    public String executeCode(String code, String input) {
        ExecutorService executor = null;
        Future<String> future = null;
        File file = null;
        try {
            file = createCodeFile(code, hostPath);

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-i",
                    "-m", "1g",
                    "-v", hostPath + ":/app/exeFile",
                    imageName,
                    "/app/exeFile/" + file.getName() // 컨테이너에서 파일 경로
            );

            processBuilder.redirectErrorStream(true);

            executor = Executors.newSingleThreadExecutor();
            future = executor.submit(() -> {
                Process process = processBuilder.start();
                try (BufferedWriter processInput = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                    processInput.write(input);
                    processInput.newLine();
                    processInput.flush();
                }
                return readProcessOutput(process.getInputStream());
            });

            return future.get(timeLimit, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            return executeTimeLimit;
        } catch (Exception e) {
            return "Exception occurred: " + e.getMessage();
        } finally {
            if (executor != null) executor.shutdownNow();
            if (file != null && file.exists()) {
                file.delete();
            }
        }
    }

    @Override
    public File createCodeFile(String code, String hostPath) throws IOException {
        final File file = File.createTempFile("Main", PYTHON.getExtension(), new File(hostPath));

        // 파일에 코드 입력
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(code);
        }

        return file;
    }
}
