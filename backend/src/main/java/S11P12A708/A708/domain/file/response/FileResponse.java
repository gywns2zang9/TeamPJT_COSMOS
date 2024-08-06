package S11P12A708.A708.domain.file.response;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.problem.entity.Problem;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class FileResponse {

    private Long fileId;
    private FileType fileType;
    private String fileName;
    private String content;

    private FileCodeResponse code;
    private List<FileProblemResponse> problems;

    public FileResponse(File file, FileCodeResponse fileCodeResponse, List<FileProblemResponse> fileProblemResponses) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.code = fileCodeResponse;
        this.problems = fileProblemResponses;
    }

    public static FileResponse fromFile(File file) {
        return new FileResponse(file, null, null);
    }

    public static FileResponse fromOverViewFile(File file, List<Problem> problems) {
        return new FileResponse(
                file,
                null,
                problems.stream().map(FileProblemResponse::of).toList());
    }

    public static FileResponse fromCodeFile(File file, Code code) {
        return new FileResponse(
                file,
                FileCodeResponse.of(code),
                null);
    }

}