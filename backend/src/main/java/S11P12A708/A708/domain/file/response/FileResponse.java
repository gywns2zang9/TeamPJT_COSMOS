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

    private Code code;
    private List<Problem> problems;

    public FileResponse(File file, Code code, List<Problem> problems) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.code = code;
        this.problems = problems;
    }

    public static FileResponse fromFile(File file) {
        if(file.getType() == FileType.CODE) return new FileResponse(file, file.getCode(), null);
        return new FileResponse(file, null, null);}

    public static FileResponse fromOverViewFile(File file, List<Problem> problems) {
        return new FileResponse(file, null, problems);
    }

}