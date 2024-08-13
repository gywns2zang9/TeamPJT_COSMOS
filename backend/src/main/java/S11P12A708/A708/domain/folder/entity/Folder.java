package S11P12A708.A708.domain.folder.entity;

import S11P12A708.A708.common.database.BaseEntity;
import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.problem.entity.Problem;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 지연 로딩 proxy 을 위해서
public class Folder extends BaseEntity {

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

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Folder> subFolders = new ArrayList<>();

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("folderIndex ASC")
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

    public void addFile(File file) {
        file.setFolderIndex(extractFolderIndex());  // 0-based index
        files.add(file);
    }

    private int extractFolderIndex() {
        int folderIndex = 0;
        if(!files.isEmpty()) {
                folderIndex = files.get(files.size()-1).getFolderIndex() + 1;
        }
        return folderIndex;
    }

    public void removeFile(File file) {
        files.remove(file);
    }

    public Folder(String name, User user, Team team, Folder parentFolder, Problem problem) {
        this.name = name;
        this.user = user;
        this.team = team;
        this.parentFolder = parentFolder;
        this.problem = problem;
    }

    public String getName() {
        if(user == null) return name;
        else return user.getNickname();
    }

    public Folder(String name, Team team, Folder parentFolder) {
        this(name, null, team, parentFolder, null);
    }

    public static Folder createRootFolder(Team team) {
        return new Folder("root", team, null);
    }

    public static Folder createProblemFolder(Team team, Folder parentFolder, Problem problem) {
        return new Folder(problem.getNumber() + ". " + problem.getName(), null, team, parentFolder, problem);
    }

    public static Folder createIndividualCodeFolder(Team team, User user,Folder parentFolder, Problem problem) {
        return new Folder(user.getNickname(), user, team, parentFolder, problem);
    }

}
