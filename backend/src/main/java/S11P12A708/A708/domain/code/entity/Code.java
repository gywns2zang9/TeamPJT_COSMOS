package S11P12A708.A708.domain.code.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Code {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Language language;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Code(String content, Language language) {
        this.content = content;
        this.language = language;
        this.createdAt = LocalDateTime.now();
    }

    public static Code createBasic() {
        return new Code("", Language.JAVA);
    }

    public void update(Code newCode) {
        this.content = newCode.getContent();
        this.language = newCode.getLanguage();
    }
}
