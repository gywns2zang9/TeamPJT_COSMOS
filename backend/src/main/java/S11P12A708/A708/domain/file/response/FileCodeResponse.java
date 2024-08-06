package S11P12A708.A708.domain.file.response;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.entity.Language;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class FileCodeResponse {

    private String content;

    private Language language;

    private LocalDateTime createdAt;

    public FileCodeResponse(String content, Language language, LocalDateTime createdAt) {
        this.content = content;
        this.language = language;
        this.createdAt = createdAt;
    }

    public static FileCodeResponse of(Code code) {
        return new FileCodeResponse(code.getContent(), code.getLanguage(), code.getCreatedAt());
    }

}
