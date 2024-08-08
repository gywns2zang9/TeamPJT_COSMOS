package S11P12A708.A708.domain.file.response;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.study.response.StudyResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class FileInfoResponse {

    private Long fileId;
    private FileType fileType;
    private String fileName;
    private String content;

    private FileCodeResponse code;
    private StudyResponse study;

    private List<FileProblemResponse> problems;

    public FileInfoResponse(File file, FileCodeResponse fileCodeResponse, List<FileProblemResponse> fileProblemResponses, StudyResponse studyResponse) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.code = fileCodeResponse;
        this.problems = fileProblemResponses;
        this.study = studyResponse;
    }

    public static FileInfoResponse fromFile(File file) {
        return new FileInfoResponse(file, null, null, null);
    }

    public static FileInfoResponse fromTimeOverViewFile(File file, List<FileProblemResponse> problems, Study study) {
        return new FileInfoResponse(
                file,
                null,
                problems,
                StudyResponse.of(study));
    }

    public static FileInfoResponse fromOverViewFile(File file, List<FileProblemResponse> problems) {
        return new FileInfoResponse(
                file,
                null,
                problems,
                null);
    }

    public static FileInfoResponse fromCodeFile(File file, Code code, List<FileProblemResponse> problems) {
        return new FileInfoResponse(
                file,
                FileCodeResponse.of(code),
                problems, null);
    }

}