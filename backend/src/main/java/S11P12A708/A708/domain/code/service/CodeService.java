package S11P12A708.A708.domain.code.service;

import S11P12A708.A708.domain.code.request.ExecuteCodeRequest;
import S11P12A708.A708.domain.code.response.ExecuteCodeResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;

@Slf4j
@Service
public class CodeService {

    public ExecuteCodeResponse getExecuteResult(ExecuteCodeRequest request) throws IOException, InterruptedException {
        String language = request.getLanguage().label(); // 언어
        String code = request.getContent(); // 코드
        String[] inputs = request.getInputs(); // input 값들

        int len = inputs.length;
        String[] results = new String[len];
        for (int i = 0; i < len; i++) {
            // input 갯수에 맞게 실행
            String result = executeCode(language, code, inputs[i]);
            results[i] = result;
        }

        return new ExecuteCodeResponse(results);
    }

    private String executeCode(String language, String code, String input) throws IOException, InterruptedException {
        // 언어에 따라서 지정하는 위치에 TempFile 생성
        // ex) Main##.py (##은 파일명이 겹치는 것을 대비해서 랜덤 숫자 자동 생성)
        File file = switch (language) {
            case "python" -> File.createTempFile("Main", ".py", new File("C:\\SSAFY\\"));
            // case "cpp" -> File.createTempFile("Main", ".cpp", new File("C:\\SSAFY\\"));
            case "java" -> File.createTempFile("Main", ".java", new File("C:\\SSAFY\\"));
            default -> throw new UnsupportedOperationException("Language not supported: " + language);
        };

        // 자바 파일의 경우, 파일명과 class 이름을 동일하게 설정
        if (language.equals("java")) {
            code = code.replaceAll("Main", file.getName().replace(".java", ""));
        }

        // 파일에 코드 입력
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(code);
        }

        ProcessBuilder processBuilder;
        Process process;

        // file.getAbsolutePath(): 파일의 위치 + 이름
        // ex) C:\SSAFY\Main4753250257583809457.py
        if (language.equals("python")) {
            // 명령어: python(python.exe 명령어가 있는 절대 위치 필요) 파일 이름(파일이 있는 절대적 위치 필요)
            processBuilder = new ProcessBuilder("C:\\Users\\SSAFY\\AppData\\Local\\Programs\\Python\\Python312\\python", file.getAbsolutePath());
            processBuilder.redirectErrorStream(true);
            process = processBuilder.start(); // 프로세스 시작
        } else { // if (language.equals("java"))
            String className = file.getName().replace(".java", "");
            // 명령어: javac(자바 컴파일러 명령어) 파일 이름(파일이 있는 절대적 위치 필요)
            // ex) Main8922551078471263860.java 에서 Main8922551078471263860.class 생성
            processBuilder = new ProcessBuilder("javac", file.getAbsolutePath());
            processBuilder.redirectErrorStream(true);
            process = processBuilder.start();
            process.waitFor();

            // 명령어: java(자바 인터프리터 명령어)
            // -cp(소스 파일이 있는 디렉토리를 클래스 경로로 지정)
            // file.getParent(): 자바 소스 파일이 위치한 디렉토리 경로
            // 실행할 클래스 이름(ex) Main8922551078471263860.class)
            processBuilder = new ProcessBuilder("java", "-cp", file.getParent(), className); 
            processBuilder.redirectErrorStream(true);
            process = processBuilder.start();
        }
//        else {
//             TODO: CPP 파일 실행 예정
//             명령어: g++ -o Main Main.cc
//            processBuilder = new ProcessBuilder("C:\\MinGW\\bin\\g++", file.getAbsolutePath(), "-o", "C:\\SSAFY\\Main");
//            processBuilder.redirectErrorStream(true);
//            process = processBuilder.start();
//            int exitCode = process.waitFor();
//            if (exitCode != 0) {
//                String errorStream = readProcessOutput(process.getErrorStream());
//                throw new IOException("C++ compilation failed with exit code " + exitCode + ": " + errorStream);
//            }
//
//            // C++ 실행 파일(Main.exe 파일) 실행
//            processBuilder = new ProcessBuilder("C:\\SSAFY\\Main");
//            processBuilder.redirectErrorStream(true);
//            process = processBuilder.start();
//        }

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
        if (language.equals("java")) {
            File classFile = new File(file.getParent(), file.getName().replace(".java", ".class"));
            if (classFile.exists()) {
                classFile.delete();
            }
        }
        return result;
    }

    private String readProcessOutput(InputStream inputStream) throws IOException {
        // 실행 시킨 결과를 한줄 씩 추가
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
