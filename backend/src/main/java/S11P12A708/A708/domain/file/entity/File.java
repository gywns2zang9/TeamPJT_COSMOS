package S11P12A708.A708.domain.file.entity;


import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.study.entity.Study;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", unique = true)
    private Study study;

    public File(String name, String content, FileType type, LocalDateTime createdAt, LocalDateTime modifiedAt, User user, Folder folder, Code code, Study study) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.user = user;
        this.folder = folder;
        this.code = code;
        this.study = study;
    }

    public File(String name, String content, FileType type, Folder folder) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.folder = folder;
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }

    public File(String name, String content, FileType type, Folder folder, Study study) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.folder = folder;
        this.study = study;
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

    public static File createTimeOverViewFile(Folder folder, Study study) {
        return new File("스터디 개요", "", FileType.TIME_OVERVIEW, folder, study);
    }

    public void update(File updateFile) {
        this.name = updateFile.getName();
        this.content = updateFile.getContent();
    }

}
