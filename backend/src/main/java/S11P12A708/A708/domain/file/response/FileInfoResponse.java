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

    public FileInfoResponse(File file, FileCodeResponse fileCodeResponse, List<FileProblemResponse> fileProblemResponses, StudyResponse studyResponse) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.code = fileCodeResponse;
        this.problems = fileProblemResponses;
        this.study = studyResponse;
    }

    public FileInfoResponse(File file, User user, FileCodeResponse fileCodeResponse, List<FileProblemResponse> fileProblemResponses, StudyResponse studyResponse) {
        this.fileId = file.getId();
        this.fileType = file.getType();
        this.fileName = file.getName();
        this.content = file.getContent();
        this.userId = user.getId();
        this.code = fileCodeResponse;
        this.problems = fileProblemResponses;
        this.study = studyResponse;
        // TODO : 기본적으로 파일 이름에 유저의 이름을 추가하는 방식으로 codeFile 네임 생성. 하지만 사용자가 임의로 추가하는 경우는?
        // TODO : codeFile의 경우는 그냥 이름을 짓지 못하고 1,2,3으로 구분할까?
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
                file.getUser(),
                FileCodeResponse.of(code),
                problems, null);
    }

    // public static FileInfoResponse fromCodeFile(File file, Code code) {
    //     return new FileInfoResponse(
    //             file,
    //             FileCodeResponse.of(code),
    //             null, null);
    // }
}