package S11P12A708.A708.common.util.executor;

import java.io.*;

import static S11P12A708.A708.domain.code.entity.Language.JAVA;

public class JavaCodeExecutor implements CodeExecutor {

    final static String imageName = "a708_1_my-java-image";
    final static String hostPath = "/tmp";

    @Override
    public String executeCode(String code, String input) {
        try {
            final File file = createCodeFile(code, hostPath);

            // 컴파일
            compileJavaFile(file);

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-i",
                    "-v", hostPath + ":/app/exeFile", // 호스트의 /tmp 디렉토리를 컨테이너에 마운트
                    imageName,
                    file.getName().replace(".java", "")
            );

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // input 데이터를 실행중인 프로세스에 입력
            try (BufferedWriter processInput = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                processInput.write(input);
                processInput.newLine();
                processInput.flush();
            }

            // 실행 결과 반환
            String result = readProcessOutput(process.getInputStream());

            // 실행한 파일들 삭제
            file.delete();
            new File(file.getAbsolutePath().replace(".java", ".class")).delete();

            return result;
        } catch (Exception e) {
            return "Exception occurred: " + e.getMessage();
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

    private void compileJavaFile(File file) throws IOException, InterruptedException {
        ProcessBuilder compileProcessBuilder = new ProcessBuilder(
                "javac", file.getAbsolutePath()
        );
        Process compileProcess = compileProcessBuilder.start();
        compileProcess.waitFor();
    }

}