package S11P12A708.A708.common.util.executor;

import java.io.*;
import java.util.concurrent.*;

import static S11P12A708.A708.domain.code.entity.Language.JAVA;

public class JavaCodeExecutor implements CodeExecutor {

    final static String imageName = imagePrefix + "my-java-image";

    @Override
    public String executeCode(String code, String input) {
        ExecutorService executor = null;
        Future<String> future = null;
        File file = null;
        try {
            file = createCodeFile(code, hostPath);
            if (!compileJavaFile(file)) return compileErrorMessage;

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-i",
                    "-m", "1g",
                    "-v", hostPath + ":/app/exeFile",
                    imageName,
                    file.getName().replace(".java", "")
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
                new File(file.getAbsolutePath().replace(".java", ".class")).delete();
            }
        }
    }


    @Override
    public File createCodeFile(String code, String hostPath) throws IOException {
        final File file = File.createTempFile("Main", JAVA.getExtension(), new File(hostPath));

        // 자바 파일의 경우, 파일명과 class 이름을 동일하게 설정
        code = code.replaceAll("Main", file.getName().replace(".java", ""));

        // 파일에 코드 입력
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(code);
        }

        return file;
    }

    private boolean compileJavaFile(File file) throws IOException, InterruptedException {
        ProcessBuilder compileProcessBuilder = new ProcessBuilder(
                "javac", file.getAbsolutePath()
        );
        Process compileProcess = compileProcessBuilder.start();

        // 컴파일 실패 시, 에러 메시지를 출력하기 위해 오류 스트림을 읽음
        InputStream errorStream = compileProcess.getErrorStream();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(errorStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.err.println(line);  // 에러 메시지를 표준 오류 출력
            }
        }

        int exitCode = compileProcess.waitFor();
        return exitCode == 0;
    }

}