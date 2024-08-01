package S11P12A708.A708.domain.folder.entity;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Folder parentFolder;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Folder> subFolders = new ArrayList<>();

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> files = new ArrayList<>();

    public void setParentFolder(Folder parentFolder) {
        this.parentFolder = parentFolder;
    }

    public void addSubFolder(Folder subFolder) {
        subFolders.add(subFolder);
        subFolder.setParentFolder(this);
    }

    public void removeSubFolder(Folder subFolder) {
        subFolders.remove(subFolder);
        subFolder.setParentFolder(null);
    }

}