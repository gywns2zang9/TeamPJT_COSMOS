package S11P12A708.A708.domain.file.response;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.entity.FileType;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.study.response.StudyResponse;
import S11P12A708.A708.domain.user.entity.User;
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
    private Long userId;

    private FileCodeResponse code;
    private StudyResponse study;

    private List<FileProblemResponse> problems;
    private List<OverViewFileProblemResponse> totalProblems;

    public FileInfoResponse(File file, FileCodeResponse fileCodeResponse, List<FileProblemResponse> fileProblemResponses, StudyResponse studyResponse, List<OverViewFileProblemResponse> totalProblems) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.code = fileCodeResponse;
        this.problems = fileProblemResponses;
        this.study = studyResponse;
        this.totalProblems = totalProblems;
    }

    public FileInfoResponse(File file, User user, FileCodeResponse fileCodeResponse, List<FileProblemResponse> fileProblemResponses, StudyResponse studyResponse, List<OverViewFileProblemResponse> totalProblems) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.userId = user.getId();
        this.code = fileCodeResponse;
        this.problems = fileProblemResponses;
        this.study = studyResponse;
        this.totalProblems = totalProblems;
    }

    public static FileInfoResponse fromFile(File file) {
        return new FileInfoResponse(file, null, null, null, null);
    }

    public static FileInfoResponse fromTimeOverViewFile(File file, List<FileProblemResponse> problems, Study study) {
        return new FileInfoResponse(
                file,
                null,
                problems,
                StudyResponse.of(study), null);
    }

    public static FileInfoResponse fromOverViewFile(File file, List<OverViewFileProblemResponse> totalProblems) {
        return new FileInfoResponse(
                file,
                null,
                null,
                null, totalProblems);
    }

    public static FileInfoResponse fromCodeFile(File file, Code code, List<FileProblemResponse> problems) {
        return new FileInfoResponse(
                file,
                file.getUser(),
                FileCodeResponse.of(code),
                problems, null, null);
    }

    // public static FileInfoResponse fromCodeFile(File file, Code code) {
    //     return new FileInfoResponse(
    //             file,
    //             FileCodeResponse.of(code),
    //             null, null);
    // }
}