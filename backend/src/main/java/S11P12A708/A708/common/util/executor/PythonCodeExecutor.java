package S11P12A708.A708.common.util.executor;

import java.io.*;

import static S11P12A708.A708.domain.code.entity.Language.PYTHON;

public class PythonCodeExecutor implements CodeExecutor {

    final static String imageName = "a708_1_my-python-image";
    final static String hostPath = "/tmp";

    @Override
    public String executeCode(String code, String input) {
        try {
            final File file = createCodeFile(code, hostPath);

            // Docker 컨테이너 실행 커맨드 구성
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-i",
                    "-v", hostPath + ":/app/exeFile", // 호스트의 /tmp 디렉토리를 컨테이너에 마운트
                    imageName,
                    "/app/exeFile/" + file.getName() // 컨테이너에서 파일 경로
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

            // 실행한 파일 삭제
            file.delete();

            return result;
        } catch (Exception e) {
//            e.printStackTrace();
            return "Exception occurred: " + e.getMessage();
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
