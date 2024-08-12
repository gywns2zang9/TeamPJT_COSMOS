package S11P12A708.A708.domain.code.entity;


import S11P12A708.A708.common.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Code extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Language language;

    public Code(String content, Language language) {
        this.content = content;
        this.language = language;
    }

    public static Code createBasic() {
        return new Code("", Language.JAVA);
    }

    public void update(Code newCode) {
        this.content = newCode.getContent();
        this.language = newCode.getLanguage();
    }
}
