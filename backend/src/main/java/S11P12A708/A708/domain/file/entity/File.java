package S11P12A708.A708.domain.file.entity;

import S11P12A708.A708.common.database.BaseEntity;
import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class File extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FileType type;

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

    public File(String name, String content, FileType type, User user, Folder folder, Code code, Study study) {
        this.name = name;
        this.content = content;
        this.type = type;
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
    }

    public File(String name, String content, FileType type, Folder folder, Study study) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.folder = folder;
        this.study = study;
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
        return new File("전체 문제목록", "", FileType.OVERVIEW, folder);
    }

    public static File createMainFile(Folder folder) {
        return new File("그룹 정보", "", FileType.MAIN, folder);
    }

    public static File createTimeOverViewFile(Folder folder, Study study) {
        return new File("문제목록", "", FileType.TIME_OVERVIEW, folder, study);
    }

    public void update(File updateFile) {
        this.name = updateFile.getName();
        this.content = updateFile.getContent();
    }

    public String getName() {
        if(type != FileType.CODE) return name;
        return this.user.getNickname() + name + this.code.getLanguage().getExtension();
    }

}
