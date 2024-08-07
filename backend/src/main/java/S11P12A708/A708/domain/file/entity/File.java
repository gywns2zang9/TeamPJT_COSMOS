package S11P12A708.A708.domain.file.entity;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.file.request.CodeFileUpdateRequest;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FileType type;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = false)
    private Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code_id")
    private Code code;

    public File(String name, String content, FileType type, LocalDateTime createdAt, LocalDateTime modifiedAt, User user, Folder folder, Code code) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.user = user;
        this.folder = folder;
        this.code = code;
    }

    public File(String name, String content, FileType type, Folder folder) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.folder = folder;
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }

    public File(String name, String content, FileType type, User user, Folder folder, Code code) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.folder = folder;
        this.user = user;
        this.code = code;
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }

    public static File createNormalFile(String name, Folder folder) {
        return new File(name, "", FileType.NORMAL, folder);
    }

    public static File createCodeFile(String name, User user, Folder folder, Code code) {
        return new File(name, "", FileType.CODE, user, folder, code);
    }

    public static File createOverViewFile(Folder folder) {
        return new File("전체 개요", "", FileType.OVERVIEW, folder);
    }

    public static File createMainFile(Folder folder) {
        return new File("메인 페이지", "", FileType.MAIN, folder);
    }

    public static File createTimeOverViewFile(Folder folder) {
        return new File("스터디 개요", "", FileType.TIME_OVERVIEW, folder);
    }

    public void update(File updateFile) {
        this.name = updateFile.getName();
        this.content = updateFile.getContent();
        this.modifiedAt = LocalDateTime.now();
    }

    public void update(CodeFileUpdateRequest req) {
        this.name = req.getName();
        this.content = req.getContent();
        this.modifiedAt = LocalDateTime.now();
    }

}
